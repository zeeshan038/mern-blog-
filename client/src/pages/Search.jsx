import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from './PostCard';

const Search = () => {
    const location = useLocation();
    const [sidebarData, setSideBarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized'
    });
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');
        
        setSideBarData({
            searchTerm: searchTermFromUrl || '',
            sort: sortFromUrl || 'desc',
            category: categoryFromUrl || 'uncategorized'
        });

        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/v1/post/getpost?${searchQuery}`);
            if (!res.ok) {
                setLoading(false);
                return;
            }
            const data = await res.json();
            setPosts(data.posts);
            setLoading(false);
            setShowMore(data.posts.length === 9);
        };

        fetchPosts();
    }, [location.search]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setSideBarData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = (e)=>{
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm' , sidebarData.searchTerm);
        urlParams.set("sort" , sidebarData.sort);
        urlParams.set('category' , sidebarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)

    }
    const handleShowMore = async()=>{
        const startIndex = posts.length;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex' , startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/v1/post/getpost?${searchQuery}`);
        if(res.ok){
            const data = await res.json();
            setPosts([...posts , ...data.posts]);
            if(data.posts.length === 9){
                setShowMore(true );
            }
            else{
                setShowMore(false);
            }
        }
    }

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='md:p-10 border-b md:border-r md:min-h-screen p-3 border-gray-500'>
                <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                    <div className='flex flex-col  gap-2 mt-10'>
                        <label className='font-bold text-[18px]'>Search:</label>
                        <input
                            type="search"
                            id='searchTerm'
                            placeholder='search here'
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                            className='w-full md:w-48 p-2 rounded-md'
                        />
                    </div>
                    <div className='flex flex-col space-y-2 '>
                        <label className='font-bold text-[18px]'>Sort:</label>
                        <select
                            className='rounded-md'
                            name="sort"
                            id="sort"
                            onChange={handleChange}
                            value={sidebarData.sort}
                        >
                            <option value="desc">Latest</option>
                            <option value="asc">Oldest</option>
                        </select>
                    </div>
                    <div className='flex flex-col space-y-2 '>
                        <label className='font-bold text-[18px]'>Category:</label>
                        <select
                            className='rounded-md'
                            name="category"
                            id="category"
                            onChange={handleChange}
                            value={sidebarData.category}
                        >
                            <option value="uncategorized">Uncategorized</option>
                            <option value="reactjs">React</option>
                            <option value="javascript">Javascript</option>
                        </select>
                    </div>
                    <button type='submit' className='bg-gray-600 text-white 
                    p-2 rounded-md hover:opacity-80'>Apply Filters</button>
                </form>
            </div>
            <div className='w-full '>
                <h1 className='text-3xl font-semibold p-3 mt-5 border-b-2'>Posts:</h1>
                <div className='p-2 flex flex-wrap justify-center mt-10 -z-10 space-x-3' >
                {
                    !loading && posts.length===0 && (
                        <p className='text-xl text-gray-500'>
                            No posts found.
                        </p>
                    )
                }
                {
                    loading && (
                        <p className='text-xl text-gray-500'> loading...</p>
                    )
                }
                {
                    !loading && posts &&  posts.map((post)=>(
                          <div className='mt-3'>
                        <PostCard key={post._id} post={post}/>
                        </div>

                    ))
                    
                     
                }
                   {
                        showMore   && (
                            <button onClick={handleShowMore} className='text-teal-500 hover:underline w-full p-7'>Show More</button>
                        )
                    }
            </div>
            </div>
          
         
        </div>
    );
};

export default Search;
