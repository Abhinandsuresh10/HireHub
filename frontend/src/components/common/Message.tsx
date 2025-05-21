  import { useState, useRef, useEffect } from 'react';
  import { FiSend, FiPaperclip, FiSmile, FiSearch, FiChevronLeft, FiMoreVertical } from 'react-icons/fi';
  import { IoCheckmarkDone } from 'react-icons/io5';
  import { io } from 'socket.io-client';
  import { RiEmojiStickerLine } from 'react-icons/ri';
  import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
  import { useParams } from 'react-router-dom';
  import { getRecruitersWithChat, getUsersWithChat } from '../../api/common/Chat';

  const socket = io("http://localhost:5000");

  socket.on('connect', () => {
    console.log("Socket connected:", socket.id);
  });

  interface CustomFile {
    name: string; 
    type: string; 
    data: string | ArrayBuffer | null; 
  }

  interface Message {
    _id?: string;
    senderId: string | undefined; 
    receiverId: string | undefined;
    message?: string;
    content?: { file: string };
    file?: CustomFile;
    sentAt: string;
    status?: 'sent' | 'delivered' | 'read';
  }

  interface Chat {
    _id: string;
    name: string;
    email: string;
    messages: Message[];
  }

  const MessageApp = () => {
    const { id, role } = useParams();

    const [chatData, setChatData] = useState<Chat[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
      if (id) {
        socket.emit("join_room", id);
      }
    }, [id]);

    useEffect(() => {
      socket.on("new_message", (newMessage) => {
        setChatData((prevChats) =>
          prevChats.map((chat) =>
            chat._id === newMessage.receiverId || chat._id === newMessage.senderId
              ? {
                  ...chat,
                  messages: [...chat.messages, newMessage],
                }
              : chat
          )
        );

        if (selectedChat?._id === newMessage.receiverId || selectedChat?._id === newMessage.senderId) {
          setSelectedChat((prevChat) => ({
            ...prevChat!,
            messages: [...(prevChat?.messages || []), newMessage],
          }));
        }
      });

      socket.on("new_file", (newFileMessage) => {
        setChatData((prevChats) =>
          prevChats.map((chat) =>
            chat._id === newFileMessage.receiverId || chat._id === newFileMessage.senderId
              ? {
                  ...chat,
                  messages: [...chat.messages, newFileMessage],
                }
              : chat
          )
        );
      
        if (!newFileMessage.content) {
          newFileMessage.content = {};
        }
        newFileMessage.content.file = newFileMessage.file
        delete newFileMessage.file
        
        if (selectedChat?._id === newFileMessage.receiverId || selectedChat?._id === newFileMessage.senderId) {
          setSelectedChat((prevChat) => ({
            ...prevChat!,
            messages: [...(prevChat?.messages || []), newFileMessage],
          }));
        }
      });

      return () => {
        socket.off("new_message");
        socket.off("new_file");
      };
    }, [selectedChat]);

    useEffect(() => {
      if (selectedChat?.messages) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, [selectedChat?.messages]);

    useEffect(() => {
      if (chatData.length > 0 ) {
        setSelectedChat(chatData[0]);
      } else {
        setSelectedChat(null);
      }
    }, [chatData]);

    useEffect(() => {
      const fetchUsersWithChat = async () => {
        if (role === 'recruiter') {
          const response = await getUsersWithChat(id as string);
          if (response && response.data.users.length > 0) {
            setChatData(response?.data.users);
          }
        } else if (role === 'user') {
          const response = await getRecruitersWithChat(id as string);
          if (response && response?.data.recruiters.length > 0) {
            setChatData(response?.data.recruiters);
          }
        }
      };
      fetchUsersWithChat();
    }, [role, id]);

    const filteredChatters = chatData.filter(chat =>
      (chat.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (chat.email?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
    );

    const handleSendMessage = () => {
      setShowEmojiPicker(false);
      if (!newMessage.trim() || !selectedChat) return;

      const newMsg: Message = {
        senderId: id,
        receiverId: selectedChat._id,
        message: newMessage,
        sentAt: new Date().toISOString()
      };

      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, newMsg]
      };

      setSelectedChat(updatedChat);
      socket.emit('sent_message', newMsg);
      setNewMessage('');
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
      setNewMessage((prev) => prev + emojiData.emoji);
    };

    const handleChatSelect = (chat: Chat) => {
      setSelectedChat(chat);
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    };

    const toggleSidebar = () => {
      setShowSidebar(!showSidebar);
    };

    const handleFileSend = (files: FileList | null) => {
      if (!files || files.length === 0 || !selectedChat) return;

      const file = files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const fileData = reader.result;

        const newMsg: Message = {
          senderId: id,
          receiverId: selectedChat._id,
          sentAt: new Date().toISOString(),
          file: {
            name: file.name,
            type: file.type,
            data: fileData as string,
          },
        };

        const updatedChat = {
          ...selectedChat,
          messages: [...selectedChat.messages, newMsg],
        };
        
        setSelectedChat(updatedChat);
        socket.emit("sent_file", newMsg);
      };

      reader.readAsDataURL(file);
    };

    return (
      <div className="flex flex-col md:flex-row h-screen bg-gray-50">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded-full shadow-lg text-indigo-600 hover:bg-indigo-50 transition-all"
        >
          <FiChevronLeft size={24} className={`transition-transform ${showSidebar ? 'rotate-180' : ''}`} />
        </button>

        {/* Sidebar */}
        <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 transform transition-transform duration-300 ease-in-out
          w-full md:w-80 bg-white border-r border-gray-200 flex flex-col fixed md:static
          h-full z-20 shadow-sm`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <h1 className="text-xl font-bold text-gray-800 mb-4">Messages</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition-all"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <FiSearch size={18} />
              </div>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChatters.map((chatter) => (
              <div
                key={chatter._id}
                onClick={() => handleChatSelect(chatter)}
                className={`flex items-center px-4 py-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${
                  selectedChat?._id === chatter._id ? 'bg-indigo-50' : ''
                }`}
              >
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
                  {chatter.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-900 truncate">{chatter.name}</p>
                    {chatter.messages.length > 0 && (
                      <span className="text-xs text-gray-400">
                        {isNaN(Date.parse(chatter.messages[chatter.messages.length - 1].sentAt))
                          ? "Invalid Date"
                          : new Date(chatter.messages[chatter.messages.length - 1].sentAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {chatter?.messages.length > 0
                      ? chatter.messages[chatter.messages.length - 1].message || "File sent"
                      : 'No messages yet'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${!showSidebar ? 'w-full' : 'hidden md:flex'} flex-1 flex flex-col bg-gray-50`}>
          <div className="bg-white px-4 py-3 flex items-center sticky top-0 z-10 border-b border-gray-200 shadow-sm">
            <button
              onClick={toggleSidebar}
              className="md:hidden mr-3 text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100"
            >
              <FiChevronLeft size={20} />
            </button>
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
              {selectedChat?.name?.charAt(0) || ''}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">{selectedChat?.name || ''}</h2>
                <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                  <FiMoreVertical size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-500">{selectedChat?.email || ''}</p>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-light_a4be512e7195b6b733d9110b408f075d.png')] bg-opacity-5">
            {selectedChat?.messages?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <RiEmojiStickerLine size={48} className="mb-4 opacity-30" />
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm">Start the conversation with {selectedChat?.name}</p>
              </div>
            ) : (
              selectedChat?.messages?.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message.senderId === id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 text-sm transition-all duration-200 ${
                      message.senderId === id
                        ? 'bg-indigo-600 text-white rounded-br-none hover:shadow-md'
                        : 'bg-white text-gray-800 shadow rounded-bl-none hover:shadow-lg'
                    }`}
                  >
                    {message.content?.file ? (
                      <div>
                        
                        {typeof message.content.file == 'string' ? (
                          <img
                            src={message.content.file}
                            alt="Uploaded file"
                            className="rounded-lg max-w-full"
                          />
                        ) : (
                          <p className="text-sm text-red-500">Invalid file data</p>
                        )}
                      </div>
                    ) : (
                      
                      <>
                      {message.content?.message ? (<p className="whitespace-pre-wrap break-words">{message.content?.message}</p>) :
                      (<p className="whitespace-pre-wrap break-words">{message.message}</p>)}
                      </>
                    )}
                    <div className="flex items-center justify-end mt-1 space-x-1">
                      <span
                        className={`text-xs ${
                          message.senderId === id ? 'text-indigo-200' : 'text-gray-500'
                        }`}
                      >
                        {new Date(message.sentAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                      {message.senderId === id && (
                        <span className="text-xs text-indigo-200">
                          <IoCheckmarkDone size={14} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="relative bg-white px-4 py-3 border-t border-gray-200">
            {showEmojiPicker && (
              <div
                className={`absolute md:absolute ${
                  window.innerWidth < 768 ? 'fixed bottom-20 ml-36 transform -translate-x-1/2' : 'bottom-14 left-0 ml-10 mb-6'
                } z-10 bg-white shadow-lg rounded-lg`}
                style={{ width: '300px', maxWidth: '90vw' }}
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="text-gray-500 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <FiSmile size={20} />
              </button>
              <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={(e) => handleFileSend(e.target.files)}
              />
              <label
                htmlFor="fileInput"
                className="text-gray-500 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <FiPaperclip size={20} />
              </label>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`p-2 rounded-full transition-all ${
                  newMessage.trim()
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default MessageApp;