import React, { useState } from 'react';
import { usePost } from '../hooks/usePost';
import AdNavbar from './AdNavbar';

const AdminAddPost = () => {
    const { adminCreatePost } = usePost();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('image', image);

        try {
            setIsSending(true);
            await adminCreatePost(formData);
            alert('Post created and approved successfully');
            setTitle('');
            setDescription('');
            setImage(null);
            setIsSending(false);
        } catch (error) {
            setIsSending(false);
            console.error('Error creating post:', error);
            alert('Error creating post');
        }
    };

    return (
        <>
        <AdNavbar />
        <div className='h-[100vh] items-center flex justify-center px-5 lg:px-0 bg-peach'>
            
            <div className="max-w-screen-xl bg-white border shadow lg:rounded-lg flex justify-center flex-1">
            <section class="bg-white-900 dark:bg-gray-900">
            <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
            <div className='flex justify-center items-center'>
            <h2 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Add a new post</h2>
             </div>
                <form onSubmit={handleSubmit}>
                <div class="sm:col-span-2">
                        <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Title:</label>
                        <input 
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                        />
                    </div>
                    <div class="sm:col-span-2">
                        <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Description:</label>
                        <textarea 
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            required 
                        />
                    </div>
                    <div class="sm:col-span-2">
                        <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Image:</label>
                        <input 
                            type="file" 
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                            onChange={(e) => setImage(e.target.files[0])} 
                            required 
                        />
                    </div>
                    <div className='flex space-x-2'>
            <button className='mt-8 mx-3 flex items-center justify-center bg-green-900 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded' type="submit"  disabled={isSending}>Create Post</button>
            <button className='mt-8 flex items-center justify-center bg-green-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Cancel</button>
            </div>
                </form>
            </div>
            </section>
            </div>
        </div>
        </>
    );
};

export default AdminAddPost;
