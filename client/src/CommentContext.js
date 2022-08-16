import React, { useState, createContext } from 'react'
import {App} from './App'
import AnimatedRoutes from './components/AnimatedRoutes';

export const CommentsContext = createContext();

function CommentContext() {
    const [commentList, setCommentList] = useState([])
 
    return (
        <>
        <CommentsContext.Provider value={{commentList, setCommentList}}>
            <AnimatedRoutes/>
        </CommentsContext.Provider>
        </>
    );
}
export default CommentContext;