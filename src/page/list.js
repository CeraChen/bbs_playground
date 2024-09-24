import { React, useState, useRef, useEffect  } from "react";
import "../css/notes.css";
import axios from 'axios';

import reading_notes_json from '../json/2024_09_24_reading_notes.json';
import api_config from '../config/api_config.json';


const IDENTITY = "Sicheng";
const HOST = api_config[IDENTITY]["HOST"];
const API_KEY = api_config[IDENTITY]["API_KEY"];
const USER_NAME = api_config[IDENTITY]["USER_NAME"];


// var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
//     function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
//     return new (P || (P = Promise))(function (resolve, reject) {
//         function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
//         function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
//         function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
//         step((generator = generator.apply(thisArg, _arguments || [])).next());
//     });
// };
// var __generator = (this && this.__generator) || function (thisArg, body) {
//     var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
//     return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
//     function verb(n) { return function (v) { return step([n, v]); }; }
//     function step(op) {
//         if (f) throw new TypeError("Generator is already executing.");
//         while (_) try {
//             if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
//             if (y = 0, t) op = [op[0] & 2, t.value];
//             switch (op[0]) {
//                 case 0: case 1: t = op; break;
//                 case 4: _.label++; return { value: op[1], done: false };
//                 case 5: _.label++; y = op[1]; op = [0]; continue;
//                 case 7: op = _.ops.pop(); _.trys.pop(); continue;
//                 default:
//                     if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
//                     if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
//                     if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
//                     if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
//                     if (t[2]) _.ops.pop();
//                     _.trys.pop(); continue;
//             }
//             op = body.call(thisArg, _);
//         } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
//         if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
//     }
// };





function NoteBlock({ name, update, content, topic_id, isExpanded, onToggle, isShort, rowRef }) {
    
    async function postContent(topicId, msg) {
        const data = {
            topic_id: parseInt(topicId),
            raw: msg
        };

        try {
            let options = {
                method: 'POST',
                headers: {
                    "Api-Key": API_KEY,
                    "Api-Username": USER_NAME
                },
                data: data,
                url: `${HOST}/posts.json`
            }
            await axios(options)
        } catch (err) {
            console.log(`err at postTopicOrPost: ${err}`)
        }

        // return __awaiter(this, void 0, void 0, function () {
        //     var options, err_2;
        //     return __generator(this, function (_a) {
        //         switch (_a.label) {
        //             case 0:
        //                 _a.trys.push([0, 2, , 3]);
        //                 options = {
        //                     method: 'POST',
        //                     headers: {
        //                         "Api-Key": API_KEY,
        //                         "Api-Username": USER_NAME
        //                     },
        //                     data: data,
        //                     url: HOST + "/posts.json"
        //                 };
        //                 return [4 /*yield*/, axios(options)
        //                     // await axios.post(`${host}/posts.json`, topic, { params })
        //                 ];
        //             case 1:
        //                 _a.sent();
        //                 return [3 /*break*/, 3];
        //             case 2:
        //                 err_2 = _a.sent();
        //                 console.log("err at postTopicOrPost: " + err_2);
        //                 return [3 /*break*/, 3];
        //             case 3: return [2 /*return*/];
        //         }
        //     });
        // });
    }



    // async function postContent(topicId, msg) {
    //     const url = `${HOST}/posts.json`;
    //     const data = {
    //         topic_id: parseInt(topicId),
    //         raw: msg
    //     };
    
    //     const response = await fetch(url, {
    //         mode: 'no-cors',
    //         method: 'POST',
    //         headers: {
    //             'Api-Key': API_KEY,
    //             'Api-Username': USER_NAME,
    //             'Content-Type': 'application/json',
    //             // "Access-Control-Allow-Origin": "http://10.79.213.213:3000"
    //         },
    //         body: JSON.stringify(data)
    //     });
    
    //     if (!response.ok) {
    //         throw new Error(`BBS server error, HTTP code ${response.status}`);
    //     }
    
    //     return response.json();
    // }
    
    
    const onClicktoReply = (topicId) => {
        const message = document.getElementById("comment-input").value;
        console.log(message);

        postContent(topicId, message)
            .then(data => console.log(data))
            .catch(error => console.error(error));
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
                            <span>As user </span><span className="bold">{USER_NAME}</span><span>,</span>
                            <button className="reply-button" onClick={() => {onClicktoReply(topic_id);}}>Reply</button>
                        </div>
                    </div>   
                </td>}
            </tr>
        </tbody>
    );
}

const Json2List = (mJson) => {
    var result_list = [];
    // console.log(mJson);
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



function ListPage( ) {
    const note_list = Json2List(reading_notes_json);

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

    var mList = note_list.map((dict, index) => {
        return <NoteBlock 
                name = {dict["name"]} 
                update = {dict["update"].substring(5)} 
                content = {dict["content"]}
                isShort = {dict["content"].length < 200}
                topic_id = {dict["topic_id"]}

                isExpanded = {index === expandedIndex}
                onToggle = {() => handleToggle(index)}
                rowRef = {rowRef}>
                </NoteBlock>
    });

    return (
        <div className="main">
            <div className="title">Latest Reading Notes Overview</div>
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
