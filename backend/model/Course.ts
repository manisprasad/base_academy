// models/Course.ts


import mongoose, { Document, Schema } from "mongoose";

// ----- Chapter Type -----
export type Chapter = {
    title: string;
    startTime: number;
    rawTimestamp: string;
};

// ----- Video Type -----
export type Video = {
    videoId: string;
    title: string;
    description: string;
    chapters: Chapter[];
    publishedAt: string;
    thumbnails: {
        low: string;
        high: string;
        max?: string;
    };
    position?: number;
};

// ----- Playlist Type -----
export type Playlist = {
    title: string;
    description: string;
    tags: string[];
    playListId: string;
    playlistThumbnail: string;
    videos: Video[];
    orderedId: number;
};

// ----- Union Course Content Item -----
export type CourseContentItem = {
    type: "video" | "playlist";
    position: number,
    video?: Video;
    playlist?: Playlist;
};

// ----- Course Interface -----
export interface CourseI extends Document {
    title: string;
    description: string;    
    tags: string[];
    category: string[],
    price: number,
    viewsCount: number,
    likesCount: number,
    enrolledUserCount: number,
    isFree: boolean,
    faq?: {
        question: string;
        answer: string;
    }[];
    prerequisites: string[],
    courseThumbnail: string;
    shortDescription: string,
    level: 'beginner' | 'intermediate' | 'advanced'; // difficulty level
    courseLink: {
        link: string,
        position:number
    }[];
    language: string,
    duration?:number,
    courseContent: CourseContentItem[];
}

// ----- Schema Definitions -----
const ChapterSchema = new Schema<Chapter>(
    {
        title: { type: String, required: true },
        startTime: { type: Number, required: true },
        rawTimestamp: { type: String, required: true },
    },
    { _id: false }
);

const VideoSchema = new Schema<Video>(
    {
        videoId: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        chapters: [ChapterSchema],
        publishedAt: { type: String, required: true },
        thumbnails: {
            low: { type: String, required: true },
            high: { type: String, required: true },
            max: { type: String },
        },
        position: { type: Number, required: true, default: -1 },
    },
    { _id: false }
);

const PlaylistSchema = new Schema<Playlist>(
    {
        title: { type: String, required: true },
        description: { type: String },
        tags: [{ type: String }],
        playlistThumbnail: { type: String, required: true },
        playListId: {
            type:String,
            required: true,
        },
        videos: [VideoSchema],
        orderedId: { type: Number, required: true },
    },
    { _id: false }
);

// ----- Course Content Item Schema (Discriminator) -----
const CourseContentItemSchema = new Schema<CourseContentItem>(
    {
        type: { type: String, enum: ["video", "playlist"], required: true },
        video: { type: VideoSchema, required: false },
        position: { type: Number, required: true },
        playlist: { type: PlaylistSchema, required: false },
    },
    { _id: false }
);

// ----- Course Schema -----
// ----- Course Schema -----
const CourseSchema = new Schema<CourseI>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        tags: [{ type: String }],
        category: [{ type: String, required: true }],
        price: {
            type: Number,
            default: 0,
            validate: {
                validator: function(this: CourseI){
                    return !(this.isFree && this.price > 0)
                },
                message: "Free courses should not have a price greater than 0",
            } 
        },
        viewsCount: { type: Number, default: 0 },
        likesCount: { type: Number, default: 0 },
        enrolledUserCount: { type: Number, default: 0 },
        isFree: { type: Boolean, required: true },
        faq: [
            {
                question: { type: String, required: true },
                answer: { type: String, required: true },
            }
        ],
        prerequisites: [{ type: String }],
        courseThumbnail: { type: String, required: true },
        shortDescription: { type: String, required: true },
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            required: true
        },
        courseLink: {
            type: [
                {
                    link: { type: String, required: true },
                    position: { type: Number, required: true }
                }
            ],
            default: [],
        },
        language: { type: String, required: true },
        duration: { type: Number },
        courseContent: {
            type: [CourseContentItemSchema],
            required: true,
        },
    },
    { timestamps: true }
);

// ----- Export Model -----
export const Course = mongoose.model<CourseI>("Course", CourseSchema);
