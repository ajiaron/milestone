import './Loading.css'
import {motion} from 'framer-motion'
function Loading() {
    return (
        <motion.div className='loadscreen' initial={{height:0}} animate={{height:'100vh'}} exit={{y:window.innerHeight, transition:{duration:.2}}}>
    
        <div className="load-up-page flex-col-hstart-vstart clip-contents">
            
         
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/5hhhfozxmbs-49%3A48?alt=media&token=042acdb5-93f6-4957-8e0d-04626d420d88"
            alt="Not Found"
            className="logo"
          />
          
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/5hhhfozxmbs-49%3A54?alt=media&token=f41bd6ce-c37c-451f-a637-83e92f4a5a45"
            alt="Not Found"
            className="logo-frame"
          />
          <p className="txt-728">milestone</p>
           <div className='bottom-slope'>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/5hhhfozxmbs-49%3A50?alt=media&token=8cfb53c5-3bf1-46bf-b47d-7259b269ba6a"
            alt="Not Found"
            className="background-vector"
          />
          </div>
         
          <div className='bottom-slope'>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/5hhhfozxmbs-49%3A52?alt=media&token=25921fea-9f63-40a4-94ce-029e02961627"
            alt="Not Found"
            className="background-vector-1"
          />
          </div>
         <div className='header-slope'>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/5hhhfozxmbs-49%3A51?alt=media&token=0c71f1bc-2a90-4852-90b9-9a7f025f16cd"
            alt="Not Found"
            className="background-vector-2"
          />
          </div>
          <div className='header-slope'>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/5hhhfozxmbs-49%3A53?alt=media&token=ff256d91-724e-4c04-be91-0c1b3190897d"
            alt="Not Found"
            className="background-vector-3"
          />
          </div>
        </div>
        </motion.div>
      )
}

export default Loading