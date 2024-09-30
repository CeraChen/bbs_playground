import { React, useState, useRef, useEffect  } from "react";
import "../css/notes.css";

import defaultJson from '../json/default.json';
import api_config from '../config/api_config.json';





function NoteBlock({ name, update, content, topic_id, isExpanded, onToggle, isShort, rowRef, IDENTITY, USER_NAME }) {
    
    const onClicktoReply = (topicId) => {
        const message = document.getElementById("comment-input").value;
        console.log(message);

        const data = {
            topic_id: parseInt(topicId),
            message: message,
            user: IDENTITY,
        };

        fetch("http://localhost:5001/api/send", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            const successful = data.result;
            const info = data.info;
            const warning = data.warning;
            console.log(info);

            const toast_area = document.getElementById("comment-result");
            toast_area.textContent = info;
            toast_area.style.color = (successful)? "rgb(52, 173, 133)" : "rgb(222, 89, 107)";         
            
            if (warning != "") {
                const user_warning = document.getElementById("user-warning");
                user_warning.textContent = warning;
                user_warning.style.color = "rgb(92, 92, 92)";
            }
            else {
                const user_warning = document.getElementById("user-warning");
                user_warning.textContent = "";
            }
        });

    };

    
    
    return (
        <tbody className="note-block">
            <tr className="note-info-row">
                <td className="member-name">{name}</td>
                <td className="update-time">{update}</td>
                <td className="toggle-button" ref={rowRef} onClick={onToggle}> {isExpanded ? '[-]' : '[+]'} </td>
                <td></td>
            </tr>

            <tr className="note-content-row">
                {isExpanded && 
                <td className="note-content" colSpan="4">
                    <div className="guidance"><span className="emoji">&#x1F4DD;</span> <span className="bold">{name}</span>'s reading note:</div>
                    <div className={isShort? "short-msg-container":"note-content-container"}> 
                        <div className="raw-html" dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                </td>}
            </tr>

            <tr className="comment-row">
                {isExpanded &&
                <td className="comment-content" colSpan="4">  
                    <div className="comment-container">               
                        <div className="guidance"><span className="emoji">&#x1F4AD;</span> Post a comment on <span className="bold">{name}</span>'s reading note:</div>
                        <textarea type="text" id="comment-input" name="inputText" />
                        <div className="comment-button-container">
                            <span>As user </span><span className="bold">{IDENTITY}</span> (<span className="bold">{USER_NAME}</span>)<span>,</span>
                            <button className="reply-button" onClick={() => {onClicktoReply(topic_id);}}>Reply</button>
                            <div id="user-warning"></div>
                            <div id="comment-result"></div>
                        </div>
                    </div>   
                </td>}
            </tr>
        </tbody>
    );
}

const Json2List = (mJson) => {
    var result_list = [];
    console.log(mJson);
    if (mJson == null) {
        mJson = defaultJson;
    }
    for (var i=1; i<100; i ++) // assume there are less than 100 members
    {
        if(i in mJson) {
            result_list.push(mJson[i]);
        }
        else{
            continue;
        }
    }
    return result_list;
};



function ListPage( {noteJson} ) {
    // const [noteJson, loadData] = useState(null);

    // useEffect(() => {
    //     console.log("to fetch");
    //     fetch("http://localhost:5000/api/load", {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         }
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log("get data");
    //         console.log(data);
    //         loadData(data);
    //     })
    //     .catch(error => {
    //         loadData(defaultJson);
    //     });
    // }, []); // Passing an empty dependency array ensures this effect runs only once

    const note_list = Json2List(noteJson);

    const [expandedIndex, setExpandedIndex] = useState(null);
    const rowRef = useRef(null);

    const handleToggle = (index) => {
        setExpandedIndex(index === expandedIndex ? null : index);
    };

    const handleExpandedChange = () => {
        if (expandedIndex !== null && rowRef.current) {
            // rowRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
            // const offset = rowRef.current.getBoundingClientRect().y;
            // console.log("Top offset:", offset);
            // console.log("innerHeight:", window.innerHeight);
            // console.log("Scroll to:", - offset + window.innerHeight * 0.8);
            // window.scrollTo(0, window.innerHeight * 0.8);

            const parentTable = document.getElementById("table");
            const topPos = parentTable.offsetTop + rowRef.current.offsetTop;
            console.log(parentTable.offsetTop);
            console.log(topPos);
            window.scrollTo({
                top: topPos,
                behavior: 'smooth'
            });
        }
    };

    // useEffect(() => {
    //     handleExpandedChange();
    // }, [expandedIndex]); 




    const [IDENTITY, setIdentity] = useState("VisBot");
    const [USER_NAME, setUserName] = useState((IDENTITY in api_config)? api_config[IDENTITY]["USER_NAME"]:"Invalid reviewer");
    useEffect(() => {
        setUserName((IDENTITY in api_config)? api_config[IDENTITY]["USER_NAME"]:"Invalid reviewer");
    }, [IDENTITY]);

    const [switch_folded, setSwitchFolded] = useState(true);
    useEffect(() => {
        const elem = document.getElementById("reviewer-role-container");
        if (switch_folded) {
            elem.style.visibility = "hidden";
        }
        else {
            elem.style.visibility = "visible";
        }
    }, [switch_folded]);

    var mList = note_list.map((dict, index) => {
        return <NoteBlock 
                name = {dict["name"]} 
                update = {dict["update"]} 
                content = {dict["content"]}
                isShort = {dict["content"].length < 200}
                topic_id = {dict["topic_id"]}

                isExpanded = {index === expandedIndex}
                onToggle = {() => handleToggle(index)}
                rowRef = {rowRef}
                
                IDENTITY = {IDENTITY}
                USER_NAME = {USER_NAME}>
                </NoteBlock>
    });

    const reviewer_users = Object.keys(api_config);
    const reviewer_items = reviewer_users.map((id) => {
        return <div className="reviewer-item" onClick={() => {
            setIdentity(id);
            setSwitchFolded(true);
        }}>{id}</div>
    });

    const onSwitchBtnClick = () => {
        setSwitchFolded(!switch_folded);
    };

    return (
        <div className="main">
            <div className="title">Latest Reading Notes Overview</div>
            <div className="reviewer-setting">
                <span className="guidance"><span className="emoji">&#x1F469;&#x1F3FB;&#x200D;&#x1F4BB;</span>You review as user: </span><span className="bold" id="current-reviewer">{IDENTITY}</span> (<span className="bold">{(IDENTITY == "VisBot")? "Default":USER_NAME}</span>) 
                <span id="switch-button" onClick={onSwitchBtnClick}>{(switch_folded)? "▼":"▲"}</span><span id="switch-guidance">{(switch_folded)? "switch":"fold"}</span>
                <div id="reviewer-role-container">
                    {!switch_folded && reviewer_items}
                </div>
            </div>
            <table className="note-table" id="table">
                <thead> 
                <tr className="note-header">
                    <td className="member-name-header"> Member </td>
                    <td className="update-time-header"> Update time </td>
                    <td className="toggle-button-header"> Expand note</td>
                    <td></td>
                </tr>
                </thead>
                {mList}
            </table>
        </div>
    );
}

export default ListPage;
