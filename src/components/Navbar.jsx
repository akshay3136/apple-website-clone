
import { navLists } from '../constants';
import  {appleImg, bagImg, searchImg} from '../utils';

function Navbar() {
  return (
  
        <header className='w-full py-5 sm:px-10 px-10 flex justify-between items-center'>
            <nav className='flex w-full screen-max-width'>
                <img src={appleImg} alt="" width={14} height={18}/>

                <div className='flex flex-1 justify-center max-sm:hidden'> 
                  {navLists.map((nav)=> (
                    <div key={nav} className='px-5 cursor-pointer text-gray-100 hover:text-white transition-all'>
                      {nav}
                    </div>

                  ))}
                </div>

                <div className='flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1'>
                  <img src={searchImg} alt="search" width={18} height={18} />
                  <img src={bagImg} alt="Bag"  width={18} height={18}/>
                </div>
            </nav>
        </header>
      
   
  )
}

export default Navbar;
