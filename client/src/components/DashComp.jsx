import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { Table } from 'flowbite-react';
import 'flowbite-react';

const DashComp = () => {
  const [getuser, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [oneMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/v1/user/getuser?limit=5', {
        method: 'GET',
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.getUser); // Correct the response structure here
        setTotalUsers(data.totalUsers);
        setLastMonthUsers(data.lastMonthUsers);
      }
    };

    const fetchPosts = async () => {
      const res = await fetch('/api/v1/post/getpost?limit=5', {
        method: 'GET',
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts); // Adjust based on actual response structure
        setTotalPosts(data.totalPosts);
        setLastMonthPosts(data.lastMonthPosts);
      }
    };

    const fetchComments = async () => {
      const res = await fetch('/api/v1/comment/getcomments?limit=5', {
        method: 'GET',
      });
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments); // Adjust based on actual response structure
        setTotalComments(data.totalComments);
        setLastMonthComments(data.oneMonthComments);
      }
    };

    fetchUsers();
    fetchPosts();
    fetchComments();
  }, [currentUser]);

  return (
    <div className='flex flex-col'>
      <div className='p-3 md:mx-auto flex-wrap flex justify-center items-center flex-col md:flex-row gap-10'>
        <div className='flex justify-between items-start md:w-96 w-full p-3 rounded-md shadow-md'>
          <div className='flex items-center gap-3 flex-col'>
            <h1 className='text-gray-500 text-md uppercase'>Total Users</h1>
            <span className='text-2xl'>{totalUsers}</span>
            <div className='flex items-center gap-0'>
              <HiArrowNarrowUp className='text-green-500' />
              <span>{lastMonthUsers}</span>
              <span className='text-gray-500 text-sm ml-2'>Last Month</span>
            </div>
          </div>
          <div>
            <HiOutlineUserGroup className='bg-teal-600 text-white text-5xl rounded-full p-3' />
          </div>
        </div>
        <div className='flex justify-between items-start md:w-96 w-full p-3 rounded-md shadow-md'>
          <div className='flex items-center gap-3 flex-col'>
            <h1 className='text-gray-500 text-md uppercase'>Total Comments</h1>
            <span className='text-2xl'>{totalComments}</span>
            <div className='flex items-center gap-0'>
              <HiArrowNarrowUp className='text-green-500' />
              <span>{oneMonthComments}</span>
              <span className='text-gray-500 text-sm ml-2'>Last Month</span>
            </div>
          </div>
          <div>
            <HiAnnotation className='bg-indigo-500 text-white text-5xl rounded-full p-3' />
          </div>
        </div>
        <div className='flex justify-between md:w-96 items-start w-full p-3 rounded-md shadow-md'>
          <div className='flex items-center gap-3 flex-col'>
            <h1 className='text-gray-500 text-md uppercase'>Total Post</h1>
            <span className='text-2xl'>{totalPosts}</span>
            <div className='flex items-center gap-0'>
              <HiArrowNarrowUp className='text-green-500' />
              <span>{lastMonthPosts}</span>
              <span className='text-gray-500 text-sm ml-2'>Last Month</span>
            </div>
          </div>
          <div>
            <HiDocumentText className='bg-lime-600 text-white text-5xl rounded-full p-3' />
          </div>
        </div>
      </div>
      <div className='flex flex-wrap justify-center items-center gap-10 py-3 mx-auto'>
        <div className='mt-2 shadow-md rounded-lg p-4 w-full md:w-[300px] h-[500px]'>
          <div className='flex justify-between items-center'>
            <h1 className='text-gray-600'>Recent Users</h1>
            <button className='bg-gray-600 text-white border-2 rounded-md px-3 hover:bg-white hover:text-black py-1 transition-all duration-300 cursor-pointer'>
              <Link to={"/dashboard?tab=user"}>See all</Link>
            </button>
          </div>
          <div className='overflow-x-auto'>
            <Table>
              <Table.Head>
                <Table.HeadCell>Image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {getuser && getuser.map((user) => (
                  <Table.Row key={user._id}>
                    <Table.Cell>
                      <img src={user.ProfileImage} alt="profile" className='w-10 h-10 rounded-full' />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
        <div className='mt-2 shadow-md rounded-lg p-4 w-full  md:w-[400px] h-[500px]'>
          <div className='flex justify-between items-center'>
            <h1 className='text-gray-600'>Recent Comments</h1>
            <button className='bg-gray-600 text-white border-2 rounded-md px-3 hover:bg-white hover:text-black py-1 transition-all duration-300 cursor-pointer'>
              <Link to={"/dashboard?tab=comments"}>See all</Link>
            </button>
          </div>
          <div className='overflow-x-auto'>
            <Table>
              <Table.Head>
                <Table.HeadCell>Comment Content</Table.HeadCell>
                <Table.HeadCell>Likes</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {comments && comments.map((comment) => (
                  <Table.Row key={comment._id}>
                    <Table.Cell>
                      <p className='line-clamp-2'>{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
        <div className='mt-2 mx-auto shadow-md rounded-lg p-4 w-full md:w-auto'>
          <div className='flex justify-between items-center'>
            <h1 className='text-gray-600'>Recent Posts</h1>
            <button className='bg-gray-600 text-white border-2 rounded-md px-3 hover:bg-white hover:text-black py-1 transition-all duration-300 cursor-pointer'>
              <Link to={"/dashboard?tab=post"}>See all</Link>
            </button>
          </div>
          <div className='overflow-x-auto'>
            <Table>
              <Table.Head>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {posts && posts.map((post) => (
                  <Table.Row key={post._id}>
                    <Table.Cell>
                      <p className='line-clamp-2'>{post.title}</p>
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashComp;
