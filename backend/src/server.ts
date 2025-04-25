    import express, { application } from "express";
    import dotenv from "dotenv";
    import cors from "cors";
    import connectDB from "./config/db";
    import userRoutes from './routes/userRoutes'
    import adminRoutes from "./routes/adminRoutes";
    import cookieParser from 'cookie-parser'
    import session from 'express-session'
    import recruiterRoutes from "./routes/recruiterRoutes";
    import jobRoutes from "./routes/JobRoutes";
    import applicationRoutes from "./routes/applicationRoutes";
    import experienceRoutes from "./routes/experienceRoutes";
    import educationRoutes from "./routes/educationRoutes";
    import skillRoutes from "./routes/skillRoutes";

    dotenv.config();
    const app = express();
    
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
    }));
    
    app.use(express.json());
    app.use(express.urlencoded({extended: true }));
    app.use(cookieParser());
    
    app.use(session({
        secret: process.env.SESSION_SECRET as string, 
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false , maxAge: 24 * 60 * 60 * 1000 } 
    }));
    
    
    connectDB();
    
    app.use('/api/users', userRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/recruiter', recruiterRoutes);
    app.use('/api/job', jobRoutes);
    app.use('/api/application', applicationRoutes);
    app.use('/api/experience', experienceRoutes);
    app.use('/api/education', educationRoutes);
    app.use('/api/skills', skillRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`server running in port ${PORT}`)
    });