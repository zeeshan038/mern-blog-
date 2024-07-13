import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CalltoAction from './CalltoAction';
import CommentSection from './CommentSection';
import PostCard from './PostCard';

const Post = () => {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    const [recentArticles, setRecentArticles] = useState([]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/v1/post/getpost?slug=${postSlug}`);
                const data = await res.json();

                if (!res.ok || data.posts.length === 0) {
                    setError(true);
                } else {
                    setPost(data.posts[0]);
                    setError(false);
                }
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postSlug]);

    useEffect(() => {
        const fetchRecentArticles = async () => {
            try {
                const res = await fetch(`/api/v1/post/getpost?limit=3`);
                const data = await res.json();

                if (res.ok) {
                    setRecentArticles(data.posts);
                }
            } catch (error) {
                console.error('Error fetching recent articles:', error);
                // Handle errors if needed
            }
        };

        fetchRecentArticles();
    }, [post]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin inline-block h-12 w-12 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error loading post</div>;
    }

    return (
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
            <h1 className='text-3xl mt-16 p-3 text-center font-serif mx-auto lg:text-4xl'>{post && post.title}</h1>
            <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
                <button className='bg-teal-500 text-white p-1 rounded-md mt-5'>
                    {post && post.category}
                </button>
            </Link>
            <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover' />
            <div className='flex justify-between items-center border-slate-500 w-full mx-auto max-w-2xl text-xs'>
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
            </div>
            <div className='max-w-4xl mt-5 mx-auto w-full post-content' dangerouslySetInnerHTML={{ __html: post && post.content }}></div>
            <div className='mx-auto mt-10'>
                <CalltoAction />
            </div>
            <div>
                <CommentSection postId={post && post._id} />
            </div>
            <div className='flex  flex-col justify-center items-center mt-8 border-b-2'>
                <div>
                    <h1 className='text-2xl font-bold '> Recent Articles</h1>
                </div>
                <div className="flex flex-wrap  justify-center gap-5 mt-5">
                    {recentArticles && recentArticles.map(post => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Post;
