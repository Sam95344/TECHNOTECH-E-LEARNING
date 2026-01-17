import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Users, Calendar, Star, Search, Heart, MessageCircle, Share2, Send, MessageCircleMore, Video } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface ChatMessage {
  id: number;
  author: string;
  avatar: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
}

interface ForumThread {
  id: number;
  title: string;
  author: string;
  avatar: string;
  category: string;
  replies: number;
  views: number;
  likes: number;
  timestamp: string;
  solved: boolean;
  userLiked?: boolean;
  showReplyBox?: boolean;
}

interface StudyGroup {
  id: number;
  name: string;
  description: string;
  members: number;
  level: string;
  nextMeeting: string;
  image: string;
  topics: string[];
  whatsappLink: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  host: string;
  participants: number;
  description: string;
  image: string;
  tags: string[];
  googleMeetLink: string;
}

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'forums' | 'groups' | 'events' | 'stories' | 'chat'>('forums');
  const [searchTerm, setSearchTerm] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, author: 'Rajesh Kumar', avatar: 'RK', message: 'Hey everyone! Just completed the React project!', timestamp: '2 min ago', isOwn: false },
    { id: 2, author: 'Priya Singh', avatar: 'PS', message: 'Congrats Rajesh! 🎉 How did you handle state management?', timestamp: '1 min ago', isOwn: false },
    { id: 3, author: 'You', avatar: 'ME', message: 'I used Context API for this project. Works great!', timestamp: 'Just now', isOwn: true },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChat, setActiveChat] = useState<'react' | 'mern' | 'python' | 'webdev'>('react');
  const [forumThreads, setForumThreads] = useState<ForumThread[]>([
    {
      id: 1,
      title: 'How to optimize React performance?',
      author: 'Rajesh Kumar',
      avatar: 'RK',
      category: 'Web Development',
      replies: 24,
      views: 156,
      likes: 45,
      timestamp: '2 hours ago',
      solved: true,
      userLiked: false,
      showReplyBox: false,
    },
    {
      id: 2,
      title: 'Best practices for MongoDB indexing',
      author: 'Priya Singh',
      avatar: 'PS',
      category: 'Database',
      replies: 18,
      views: 98,
      likes: 32,
      timestamp: '5 hours ago',
      solved: true,
      userLiked: false,
      showReplyBox: false,
    },
    {
      id: 3,
      title: 'Docker vs Kubernetes for beginners?',
      author: 'Aditya Jain',
      avatar: 'AJ',
      category: 'DevOps',
      replies: 31,
      views: 204,
      likes: 58,
      timestamp: '1 day ago',
      solved: false,
      userLiked: false,
      showReplyBox: false,
    },
    {
      id: 4,
      title: 'Machine Learning model deployment strategies',
      author: 'Neha Sharma',
      avatar: 'NS',
      category: 'Data Science',
      replies: 12,
      views: 87,
      likes: 28,
      timestamp: '3 days ago',
      solved: true,
      userLiked: false,
      showReplyBox: false,
    },
  ]);
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: chatMessages.length + 1,
        author: 'You',
        avatar: 'ME',
        message: newMessage,
        timestamp: 'Just now',
        isOwn: true,
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const handleLikeThread = (id: number) => {
    setForumThreads(forumThreads.map(thread =>
      thread.id === id
        ? {
            ...thread,
            likes: thread.userLiked ? thread.likes - 1 : thread.likes + 1,
            userLiked: !thread.userLiked,
          }
        : thread
    ));
  };

  const handleToggleReply = (id: number) => {
    setForumThreads(forumThreads.map(thread =>
      thread.id === id
        ? { ...thread, showReplyBox: !thread.showReplyBox }
        : thread
    ));
  };

  const handleReplySubmit = (id: number) => {
    if (replyText[id]?.trim()) {
      setForumThreads(forumThreads.map(thread =>
        thread.id === id
          ? { ...thread, replies: thread.replies + 1, showReplyBox: false }
          : thread
      ));
      setReplyText({ ...replyText, [id]: '' });
    }
  };

  const onlineUsers = [
    { name: 'Rajesh Kumar', avatar: 'RK', status: 'online', skill: 'React Developer' },
    { name: 'Priya Singh', avatar: 'PS', status: 'online', skill: 'Data Scientist' },
    { name: 'Aditya Jain', avatar: 'AJ', status: 'online', skill: 'Full Stack Dev' },
    { name: 'Neha Sharma', avatar: 'NS', status: 'away', skill: 'UI/UX Designer' },
    { name: 'Vikram Singh', avatar: 'VS', status: 'online', skill: 'DevOps Engineer' },
  ];

  // Study Groups Data
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([
    {
      id: 1,
      name: 'React Advanced Concepts',
      description: 'Deep dive into React hooks, context API, and performance optimization',
      members: 342,
      level: 'Advanced',
      nextMeeting: 'Jan 20, 2026 - 7:00 PM IST',
      image: '🚀',
      topics: ['React', 'JavaScript', 'Performance'],
      whatsappLink: '',
    },
    {
      id: 2,
      name: 'Python for Data Science',
      description: 'Master pandas, numpy, scikit-learn, and machine learning fundamentals',
      members: 598,
      level: 'Intermediate',
      nextMeeting: 'Jan 19, 2026 - 6:00 PM IST',
      image: '🐍',
      topics: ['Python', 'Data Science', 'ML'],
      whatsappLink: '',
    },
    {
      id: 3,
      name: 'Full Stack MERN Stack',
      description: 'Complete guide to MongoDB, Express, React, and Node.js development',
      members: 456,
      level: 'Intermediate',
      nextMeeting: 'Jan 22, 2026 - 8:00 PM IST',
      image: '🔗',
      topics: ['MERN', 'Full Stack', 'Backend'],
      whatsappLink: '',
    },
    {
      id: 4,
      name: 'DevOps & Cloud Deployment',
      description: 'Learn Docker, Kubernetes, AWS, and modern deployment practices',
      members: 287,
      level: 'Advanced',
      nextMeeting: 'Jan 21, 2026 - 7:30 PM IST',
      image: '☁️',
      topics: ['Docker', 'Kubernetes', 'AWS'],
      whatsappLink: '',
    },
    {
      id: 5,
      name: 'UI/UX Design Principles',
      description: 'Master design thinking, prototyping, and user experience design',
      members: 324,
      level: 'Beginner',
      nextMeeting: 'Jan 23, 2026 - 6:30 PM IST',
      image: '🎨',
      topics: ['Design', 'Figma', 'UX'],
      whatsappLink: '',
    },
    {
      id: 6,
      name: 'JavaScript Interview Prep',
      description: 'Prepare for JavaScript interviews with DSA, patterns, and best practices',
      members: 567,
      level: 'Intermediate',
      nextMeeting: 'Jan 20, 2026 - 8:30 PM IST',
      image: '📝',
      topics: ['JavaScript', 'Interviews', 'DSA'],
      whatsappLink: '',
    },
  ]);

  // Events Data
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'React Advanced Workshop',
      date: 'Jan 20, 2026',
      time: '5:00 PM - 7:00 PM IST',
      host: 'Shamshad Alam',
      participants: 128,
      description: 'Master React hooks, custom hooks, and performance optimization',
      image: '🚀',
      tags: ['Workshop', 'React', 'Beginner Friendly'],
      googleMeetLink: '',
    },
    {
      id: 2,
      title: 'Web Development AMA Session',
      date: 'Jan 21, 2026',
      time: '6:00 PM - 7:30 PM IST',
      host: 'Expert Panel',
      participants: 256,
      description: 'Ask anything about web development careers, learning paths, and industry trends',
      image: '💬',
      tags: ['AMA', 'Q&A', 'Career Advice'],
      googleMeetLink: '',
    },
    {
      id: 3,
      title: 'Machine Learning Bootcamp Day 1',
      date: 'Jan 22, 2026',
      time: '7:00 PM - 9:00 PM IST',
      host: 'ML Community Lead',
      participants: 89,
      description: 'Introduction to ML, setup, and your first ML project',
      image: '🤖',
      tags: ['Bootcamp', 'ML', 'Hands-on'],
      googleMeetLink: '',
    },
    {
      id: 4,
      title: 'Design Trends 2026 Panel Discussion',
      date: 'Jan 23, 2026',
      time: '4:00 PM - 5:30 PM IST',
      host: 'Design Team',
      participants: 167,
      description: 'Latest design trends, tools, and what designers should learn in 2026',
      image: '🎨',
      tags: ['Design', 'Trends', 'Panel'],
      googleMeetLink: '',
    },
    {
      id: 5,
      title: 'Networking Meetup - Tech Professionals',
      date: 'Jan 25, 2026',
      time: '6:30 PM - 8:00 PM IST',
      host: 'Community Team',
      participants: 342,
      description: 'Connect with fellow learners, developers, and tech professionals',
      image: '🤝',
      tags: ['Networking', 'Meetup', 'Community'],
      googleMeetLink: '',
    },
  ]);

  // Success Stories Data
  const successStories = [
    {
      id: 1,
      name: 'Raj Patel',
      role: 'Software Engineer @ Google',
      story: 'I started with zero coding knowledge. After completing the full-stack course and participating in study groups, I landed a job at Google in just 9 months. The community support and project-based learning were game-changers!',
      image: '👨',
      before: 'Unemployed',
      after: 'Google SWE',
      timeframe: '9 months',
      featured: true,
    },
    {
      id: 2,
      name: 'Priya Sharma',
      role: 'Data Scientist @ Amazon',
      story: 'The Python and ML courses transformed my career. The forums helped me resolve doubts quickly, and the study groups kept me motivated throughout the learning journey.',
      image: '👩',
      before: 'Manual QA',
      after: 'Data Scientist',
      timeframe: '12 months',
      featured: true,
    },
    {
      id: 3,
      name: 'Aditya Kumar',
      role: 'Freelance Full Stack Developer',
      story: 'As a freelancer, the MERN stack course helped me take on bigger projects and increase my rates. The community marketplace connected me with high-paying clients!',
      image: '👨',
      before: 'Low Income Freelancer',
      after: 'Premium Freelancer',
      timeframe: '6 months',
      featured: false,
    },
    {
      id: 4,
      name: 'Neha Desai',
      role: 'UI/UX Designer @ Flipkart',
      story: 'Coming from no design background, the UI/UX course and design community gave me the confidence and portfolio to land my dream job at Flipkart.',
      image: '👩',
      before: 'Marketing Executive',
      after: 'UX Designer',
      timeframe: '8 months',
      featured: false,
    },
    {
      id: 5,
      name: 'Vikram Singh',
      role: 'DevOps Engineer @ Microsoft',
      story: 'The DevOps bootcamp and hands-on projects prepared me perfectly. The forums and study groups were invaluable for clearing concepts and getting tips from experienced professionals.',
      image: '👨',
      before: 'System Administrator',
      after: 'DevOps Engineer',
      timeframe: '7 months',
      featured: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-slate-50 via-sky-200 to-emerald-300 bg-clip-text text-transparent tracking-tight">
              Community
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Connect, learn, and grow with our vibrant community of learners and professionals
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { id: 'forums', label: 'Forums', icon: MessageSquare },
              { id: 'groups', label: 'Study Groups', icon: Users },
              { id: 'events', label: 'Events', icon: Calendar },
              { id: 'stories', label: 'Success Stories', icon: Star },
              { id: 'chat', label: 'Live Chat', icon: MessageCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-[0_10px_30px_rgba(14,165,233,0.5)]'
                      : 'bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Forums Section */}
          {activeTab === 'forums' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search forum threads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none"
                />
              </div>

              <div className="space-y-4">
                {forumThreads.map((thread) => (
                  <div
                    key={thread.id}
                    className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600/70 transition-all duration-300"
                  >
                    {/* Thread Header */}
                    <div className="p-6 hover:bg-slate-700/20 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                            {thread.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{thread.author}</p>
                            <p className="text-xs text-slate-400">{thread.timestamp}</p>
                          </div>
                          {thread.solved && (
                            <span className="ml-auto bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs px-3 py-1 rounded-full font-semibold">
                              ✓ Solved
                            </span>
                          )}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3 hover:text-sky-400 transition-colors">
                        {thread.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                        <span className="bg-slate-700/50 px-2 py-1 rounded text-xs">{thread.category}</span>
                        <span>{thread.replies} replies</span>
                        <span>{thread.views} views</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-6 border-t border-slate-700/50 pt-4">
                        <button
                          onClick={() => handleLikeThread(thread.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                            thread.userLiked
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'text-slate-400 hover:bg-slate-700/50'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${thread.userLiked ? 'fill-current' : ''}`} />
                          <span>{thread.likes}</span>
                        </button>
                        <button
                          onClick={() => handleToggleReply(thread.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-700/50 font-semibold transition-all"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>Reply</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-700/50 font-semibold transition-all">
                          <Share2 className="w-5 h-5" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>

                    {/* Reply Box */}
                    {thread.showReplyBox && (
                      <div className="border-t border-slate-700/50 bg-slate-800/30 p-6 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold mt-1">
                            ME
                          </div>
                          <div className="flex-1">
                            <textarea
                              value={replyText[thread.id] || ''}
                              onChange={(e) => setReplyText({ ...replyText, [thread.id]: e.target.value })}
                              placeholder="Share your thoughts or answer..."
                              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all resize-none min-h-[80px]"
                            />
                            <div className="flex items-center gap-3 mt-3">
                              <button
                                onClick={() => handleReplySubmit(thread.id)}
                                className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-[0_10px_30px_rgba(14,165,233,0.5)] transition-all"
                              >
                                Post Reply
                              </button>
                              <button
                                onClick={() => handleToggleReply(thread.id)}
                                className="text-slate-400 hover:text-white transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Study Groups Section */}
          {activeTab === 'groups' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studyGroups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/70 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                  >
                    <div className="text-4xl mb-3">{group.image}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{group.name}</h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{group.description}</p>
                    <div className="space-y-3 mb-4 pb-4 border-b border-slate-700/50">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Members</span>
                        <span className="text-white font-semibold">{group.members}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Level</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          group.level === 'Beginner' ? 'bg-emerald-500/20 text-emerald-300' :
                          group.level === 'Intermediate' ? 'bg-sky-500/20 text-sky-300' :
                          'bg-purple-500/20 text-purple-300'
                        }`}>
                          {group.level}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        <p>Next Meeting:</p>
                        <p className="text-sky-300 font-semibold">{group.nextMeeting}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {group.topics.map((topic, idx) => (
                        <span key={idx} className="bg-slate-700/50 text-slate-300 text-xs px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                    <button className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-2 rounded-lg font-semibold hover:shadow-[0_10px_30px_rgba(14,165,233,0.5)] transition-all hover:scale-105">
                      Join Group
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Section */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/70 transition-all duration-300 group"
                >
                  <div className="flex gap-6">
                    <div className="text-5xl flex-shrink-0">{event.image}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-slate-300 mb-4">{event.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="text-sm">
                          <p className="text-slate-400">Date & Time</p>
                          <p className="text-white font-semibold">{event.date} • {event.time}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-slate-400">Host</p>
                          <p className="text-white font-semibold">{event.host}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                          <Users className="w-4 h-4" />
                          <span>{event.participants} registered</span>
                        </div>
                        {event.tags.map((tag, idx) => (
                          <span key={idx} className="bg-slate-700/50 text-slate-300 text-xs px-3 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="flex-shrink-0 bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-[0_10px_30px_rgba(14,165,233,0.5)] transition-all hover:scale-105 h-fit">
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Live Chat Section */}
          {activeTab === 'chat' && (
            <div className="grid lg:grid-cols-4 gap-6 h-[600px]">
              {/* Chat Rooms Sidebar */}
              <div className="lg:col-span-1 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 overflow-y-auto">
                <div className="mb-6 pb-6 border-b border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-3">Your Courses</h3>
                  <p className="text-xs text-slate-400 mb-4">Chat with classmates in your enrolled courses</p>
                </div>

                <h3 className="text-lg font-bold text-white mb-4">Course Chat Rooms</h3>
                <div className="space-y-2">
                  {[
                    { id: 'react', name: 'React Advanced', badge: '24 online' },
                    { id: 'mern', name: 'Full Stack MERN', badge: '18 online' },
                    { id: 'python', name: 'Python for DS', badge: '12 online' },
                    { id: 'webdev', name: 'Web Dev Bootcamp', badge: '15 online' },
                  ].map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setActiveChat(room.id as any)}
                      className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                        activeChat === room.id
                          ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white'
                          : 'text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${activeChat === room.id ? 'bg-white' : 'bg-emerald-500'}`}></span>
                          {room.name}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${activeChat === room.id ? 'text-white/80' : 'text-slate-500'}`}>
                        {room.badge}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Online Users */}
                <div className="mt-8 pt-6 border-t border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-4">Course Members</h3>
                  <div className="space-y-3">
                    {onlineUsers.map((user, idx) => (
                      <div key={idx} className="flex items-center gap-3 cursor-pointer hover:bg-slate-700/50 p-2 rounded-lg transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                          {user.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                          <p className="text-xs text-slate-400 truncate">{user.skill}</p>
                        </div>
                        <span className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-3 flex flex-col bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 border-b border-slate-700/50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {activeChat === 'react' && 'React Advanced Course'}
                        {activeChat === 'mern' && 'Full Stack MERN Course'}
                        {activeChat === 'python' && 'Python for Data Science'}
                        {activeChat === 'webdev' && 'Web Dev Bootcamp'}
                      </h2>
                      <p className="text-sm text-slate-400">Connect with your classmates</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {onlineUsers.slice(0, 3).map((user, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold border-2 border-slate-800"
                          >
                            {user.avatar}
                          </div>
                        ))}
                      </div>
                      <span className="text-sm text-slate-400">Course members</span>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.isOwn ? 'flex-row-reverse' : ''}`}
                    >
                      {!msg.isOwn && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {msg.avatar}
                        </div>
                      )}
                      <div className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}>
                        {!msg.isOwn && (
                          <p className="text-xs text-slate-400 mb-1">
                            {msg.author} <span className="text-slate-500">• {msg.timestamp}</span>
                          </p>
                        )}
                        <div
                          className={`px-4 py-2 rounded-lg max-w-xs ${
                            msg.isOwn
                              ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-br-none'
                              : 'bg-slate-700/50 text-slate-100 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                        </div>
                        {msg.isOwn && (
                          <p className="text-xs text-slate-400 mt-1">{msg.timestamp}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message here..."
                      className="flex-1 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white p-3 rounded-lg hover:shadow-[0_10px_30px_rgba(14,165,233,0.5)] transition-all hover:scale-105"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Stories Section */}
          {activeTab === 'stories' && (
            <div className="space-y-6">
              {successStories.map((story) => (
                <div
                  key={story.id}
                  className={`rounded-xl p-8 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 ${
                    story.featured
                      ? 'bg-gradient-to-br from-sky-500/20 via-emerald-500/20 to-purple-500/20 border-2 border-sky-500/50'
                      : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50'
                  }`}
                >
                  {story.featured && (
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold text-sm">Featured Story</span>
                    </div>
                  )}
                  <div className="flex items-start gap-6 mb-6">
                    <div className="text-5xl flex-shrink-0">{story.image}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-1">{story.name}</h3>
                      <p className="text-sky-400 font-semibold mb-3">{story.role}</p>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                          <p className="text-slate-400 text-sm">Before</p>
                          <p className="text-white font-semibold text-sm">{story.before}</p>
                        </div>
                        <div className="flex items-center justify-center">
                          <span className="text-emerald-400 text-2xl">→</span>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                          <p className="text-slate-400 text-sm">After</p>
                          <p className="text-white font-semibold text-sm">{story.after}</p>
                        </div>
                      </div>
                      <p className="text-emerald-400 font-semibold mb-4">Timeframe: {story.timeframe}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-lg">"{story.story}"</p>
                  <div className="flex gap-4 mt-6 pt-6 border-t border-slate-700/50">
                    <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">Inspire</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-sky-500/20 via-emerald-500/20 to-purple-500/20 backdrop-blur-xl border border-sky-500/30 rounded-2xl p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Thriving Community</h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              Connect with thousands of learners, ask questions, share knowledge, and grow together
            </p>
            <button className="inline-flex items-center bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-[0_10px_30px_rgba(59,130,246,0.5)] hover:shadow-[0_14px_40px_rgba(59,130,246,0.7)] transition-all duration-200 transform hover:scale-105 border border-white/10">
              Start Connecting Now
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Community;
