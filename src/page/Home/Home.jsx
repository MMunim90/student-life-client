import React from 'react';
import ThemeButton from '../../sharedItem/ThemeButton';
import { ImMail2 } from 'react-icons/im';
import { BsWhatsapp } from 'react-icons/bs';

const Home = () => {
    return (
        <div>
            <ThemeButton></ThemeButton>
            
            <div className='w-11/12 mx-auto my-3 grid grid-cols-12 gap-5 mt-6'>
            <section className='main col-span-11 xl:col-span-8'>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quisquam repellendus tenetur nisi omnis aliquid distinctio dolores iusto at eos libero porro fugiat dicta rem excepturi rerum eius aperiam vel exercitationem molestias, nobis eaque quam, impedit ullam? Facilis commodi harum, sunt exercitationem sed non voluptate! Ab illo fuga nemo ipsam omnis?
                </p>
            </section>

            <aside className='hidden xl:block col-span-3 sticky top-0 h-fit'>
                <div className='space-y-3 mb-4'>
                    <div className='border-2 px-4 py-2'>
                        <h1 className='text-2xl mb-2 border-b-2 pb-2'>Sponsor</h1>
                    </div>
                    <div className='border-2 px-4 py-2'>
                        <h1 className='text-2xl mb-2 border-b-2 pb-2'>Contact</h1>
                        <div className='space-y-2'>
                            <p className='flex gap-3 text-lg items-center'><ImMail2 size={20}/>shahan.al.munim<br />@gmail.com</p>
                            <p className='flex gap-3 text-lg items-center'>
                            <BsWhatsapp size={20} />+8801705620458</p>
                        </div>
                    </div>
                </div>
                <p>&copy; {new Date().getFullYear()} BrainBox by MMunim</p>
            </aside>
            </div>

        </div>
    );
};

export default Home;