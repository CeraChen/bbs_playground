import { React, useState, useRef, useEffect  } from "react";
import "../css/notes.css"

import reading_notes_json from '../json/2024_09_23_reading_notes.json'


function NoteBlock({ name, update, content, isExpanded, onToggle, isShort, rowRef }) {
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
                    <div className={isShort? "short-msg-container":"note-content-container"}>
                        <div className="raw-html" dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                </td>}
            </tr>
        </tbody>
    );
}

const Json2List = (mJson) => {
    var result_list = [];
    console.log(mJson);
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
