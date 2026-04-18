
import React from 'react';

// Icon components - minimalist and linear, as per branding.
const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
    {children}
  </svg>
);

const ImageEditIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 00-1.622-3.385m-5.043-.025a15.998 15.998 0 01-3.388-1.621m7.704 4.252a15.998 15.998 0 00-3.388-1.622m-5.043-.025a15.998 15.998 0 01-1.622-3.385m-1.622 3.385a15.998 15.998 0 013.388 1.622m5.043.025a15.998 15.998 0 003.388 1.622m-1.622-3.385a15.998 15.998 0 00-3.388-1.622m-3.388 1.622a15.998 15.998 0 011.622 3.385" /></IconWrapper>;
const AudioSparkIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V7.5a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 7.5v6.553a3.375 3.375 0 006.75 0V9" /></IconWrapper>;
export const MovieIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3.75v3.75m-3.75-3.75v3.75m-3.75-3.75h15a1.5 1.5 0 001.5-1.5v-6a1.5 1.5 0 00-1.5-1.5h-15a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 001.5 1.5zm1.5-6.75h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zM12 13.5h.75v.75h-.75v-.75zm.75-2.25h.75v.75h-.75v-.75zM15 13.5h.75v.75h-.75v-.75zm.75-2.25h.75v.75h-.75v-.75zM9 13.5h.75v.75h-.75v-.75zm.75-2.25h.75v.75h-.75v-.75z" /></IconWrapper>;
const GoogleIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>;
const MapPinIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></IconWrapper>;
const ImageIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25z" /></IconWrapper>;
export const SparkleIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456-2.456zM18.259 15.715L18 14.75l-.259 1.035a3.375 3.375 0 00-2.455 2.456L14.25 18l1.036.259a3.375 3.375 0 002.455 2.456L18 21.75l.259-1.035a3.375 3.375 0 00-2.456-2.456L21.75 18l-1.035-.259a3.375 3.375 0 00-2.456-2.456z" /></IconWrapper>;
export const VoiceChatIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m3.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457.168-.928.23-1.402 1.151.84 2.563 1.34 4.042 1.34 4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.927 1.18 2.21 2.055 3.577 2.583" /></IconWrapper>;
const AspectRatioIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18V3H3zm4.5 13.5H6v-1.5h1.5v1.5zm0-3.75H6V9h1.5v1.5zm0-3.75H6V5.25h1.5v1.5zm3.75 7.5H9v-1.5h1.5v1.5zm0-3.75H9V9h1.5v1.5zm0-3.75H9V5.25h1.5v1.5zm3.75 7.5h-1.5v-1.5h1.5v1.5zm0-3.75h-1.5V9h1.5v1.5zm0-3.75h-1.5V5.25h1.5v1.5zm3.75 7.5H18v-1.5h1.5v1.5zm0-3.75H18V9h1.5v1.5zm0-3.75H18V5.25h1.5v1.5z" /></IconWrapper>;
const DocScannerIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>;
const BoltIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></IconWrapper>;
export const VideoLibraryIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.12 1.243H4.512c-.657 0-1.19-.585-1.12-1.243l1.263-12A3.75 3.75 0 017.5 4.5h9a3.75 3.75 0 013.75 3.75Z" /></IconWrapper>;
export const MicIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 5.25v-1.5a6 6 0 00-12 0v1.5m6-6.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12 12.75a3 3 0 100-6 3 3 0 000 6z" /></IconWrapper>;
export const BrainIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.004 1.11-1.226a2.25 2.25 0 012.593 1.226c.09.542.56 1.004 1.11 1.226a2.25 2.25 0 011.226 2.593c-.222.55-.684 1.02-1.226 1.11a2.25 2.25 0 01-2.593-1.226c-.09-.542-.56-1.004-1.11-1.226a2.25 2.25 0 01-1.226-2.593c.222-.55.684-1.02 1.226-1.11zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>;
export const ChartIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.5m-2-1.5h-5.25m0 0l-1-1.5m1.5 1.5v-5.25m0 0l1.5-1.5m-1.5-1.5l-1.5-1.5m0 0l-1.5 1.5m3 0l-1.5 1.5m0 0l-1.5-1.5m0 0l1.5-1.5m-1.5 1.5h5.25m0 0l1.5 1.5" /></IconWrapper>;
export const BookIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6-2.292m0 0v14.25" /></IconWrapper>;
export const ObservatoriumIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></IconWrapper>;
export const ChecklistIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>;
export const AuroraIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></IconWrapper>;
export const DocumentReportIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></IconWrapper>;


export const FEATURES = [
  {
    icon: SparkleIcon,
    title: "Gemini Intelligence",
    description: "Analyze contents, edit, and more with Gemini Pro for complex tasks and Flash for speed.",
    link: "nexus"
  },
  {
    icon: VoiceChatIcon,
    title: "AI Marketing Chat",
    description: "Brainstorm with an AI advisor specialized in marketing strategies, providing real-time answers.",
    link: "konversator"
  },
  {
    icon: AudioSparkIcon,
    title: "Conversational Voice AI",
    description: "Hold natural real-time voice conversations with the Gemini Live API and receive responses with human-like voice.",
    link: "auditor"
  },
  {
    icon: ImageIcon,
    title: "Generate Images with Prompts",
    description: "Create stunning visuals from text descriptions with Imagen 4 and transform your ideas into high-quality images.",
    link: "visionar"
  },
  {
    icon: ImageEditIcon,
    title: "Nano Banana Image Editing",
    description: "Use text prompts for intuitive image editing. Add filters or change styles with Gemini 2.5 Flash Image.",
    link: "visionar"
  },
  {
    icon: MovieIcon,
    title: "Animate Images with Veo",
    description: "Bring static images to life by generating dynamic videos and creating captivating content from a single photo.",
    link: "animator"
  },
  {
    icon: GoogleIcon,
    title: "Google Search Grounding",
    description: "Access current and accurate information by basing answers on real-time data from Google Search.",
    link: "spaeher"
  },
  {
    icon: MapPinIcon,
    title: "Google Maps Grounding",
    description: "Provide geographically relevant answers and location-based information by connecting to Google Maps data.",
    link: "konversator"
  },
  {
    icon: AspectRatioIcon,
    title: "Control Image Aspect Ratios",
    description: "Generate images in various aspect ratios (1:1, 16:9 etc.) to perfectly fit your creative needs.",
    link: "visionar"
  },
  {
    icon: DocScannerIcon,
    title: "Analyze Images",
    description: "Upload a photo and gain deep insights. Gemini can understand visual content and analyze it for key information.",
    link: "visionar"
  },
  {
    icon: BoltIcon,
    title: "Fast AI Responses",
    description: "Achieve real-time interactions with low latency using Gemini 2.5 Flash-Lite, perfect for responsive applications.",
    link: "konversator"
  },
  {
    icon: VideoLibraryIcon,
    title: "Video Understanding",
    description: "Analyze video content to extract key information, summarize scenes, and understand complex narratives with Gemini Pro.",
    link: "mediathek"
  },
  {
    icon: MicIcon,
    title: "Transcribe Audio",
    description: "Convert spoken words into text with high accuracy. Transcribe user audio from the microphone in real-time.",
    link: "auditor"
  },
  {
    icon: BrainIcon,
    title: "Thinking Mode for Complex Queries",
    description: "Tackle the most demanding tasks by activating Gemini 2.5 Pro's thinking mode for deeper analysis.",
    link: "stratege"
  },
];
