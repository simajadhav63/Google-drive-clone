import React, { useState } from 'react';
import styled from 'styled-components';
import MobileScreenShareIcon from '@mui/icons-material/MobileScreenShare';
import DevicesIcon from '@mui/icons-material/Devices';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import { Modal } from '@mui/material';
import { db, storage } from '../firebase';
import firebase from "firebase";

const SidebarContainer = styled.div`
    margin-top: 20px;
`
const SidebarBtn = styled.div`
    button {
        background: transparent;
        border: 1px solid lightgray;
        display: flex;
        align-items: center;
        border-radius: 40px;
        padding:  3px 8px;
        box-shadow:2px 2px 2px #ccc;
        margin-left: 20px;
        span {
            font-size: 15px;
            margin-right: 20px;
            margin-left: 10px;
        }
    }
`

const SidebarOptions = styled.div`
    margin-top: 10px;
    .progress_bar {
        padding: 0px 20px;
    }
    .progress_bar span {
       margin-top: 10px;
        display: block;
        color:red;
        font-size: 14px;
    }
`

const SidebarOption = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 30px;
    border-radius: 20px 20px 20px 20px;
    &:hover{
        background: skyblue;
        cursor: pointer;
    }
    svg.MuiSvgIcon-root {
        color:rgb(78, 78, 78);
    }
    span {
        margin-left: 15px;
        font-size: 16px;
        font-weight: 600;
        color: black;
    }
`

const ModalPopup = styled.div`
    top: 50%;
    background-color: #fff;
    width: 500px;
    margin: 0px auto;
    position: relative;
    transform: translateY(-50%);
    padding: 10px;
    border-radius: 10px;
`

const ModalHeading = styled.div`
    text-align: center;
    border-bottom: 1px solid lightgray;
    height: 40px;
`

const ModalBody = styled.div`
    input.modal__submit {
        width: 100%;
        background: darkmagenta;
        padding: 10px 20px;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 5px;
        font-size: 16px;
        border: 0;
        outline: 0;
        border-radius: 5px;
        cursor: pointer;
        margin-top:20px
    }
    input.modal__file {
        background: whitesmoke;
        padding: 20px;
        color: #000;
        display: block;
        margin-top:20px
    }
`

const UploadingPara = styled.p`
    background: green;
    color: #fff;
    margin: 20px;
    text-align: center;
    padding: 10px;
    letter-spacing: 1px;
`

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);

    const handleFile = e => {
        if(e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = e => {
        e.preventDefault()
        setUploading(true)
        storage.ref(`files/${file.name}`).put(file).then(snapshot => {
            storage.ref("files").child(file.name).getDownloadURL().then(url => {
                db.collection("myfiles").add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    filename: file.name,
                    fileURL: url,
                    size: snapshot._delegate.bytesTransferred
                })
                setUploading(false)
                setFile(null)
                setOpen(false)
            })
        })
    }

    return (
        <>
        <Modal open={open} onClose={() => setOpen(false)}>
            <ModalPopup>
                <form onSubmit={handleUpload}>
                    <ModalHeading>
                        <h3>Select file you want to upload</h3>
                    </ModalHeading>
                    <ModalBody>
                        {uploading ? <UploadingPara>Uploading...</UploadingPara> : (
                            <>
                                <input type="file" className='modal__file' onChange={handleFile} />
                                <input type="submit" className='modal__submit' />
                            </>
                        )}
                    </ModalBody>
                </form>
            </ModalPopup>
        </Modal>
        <SidebarContainer>
            <SidebarBtn>
                <button onClick={() => setOpen(true)}>
                    <img src="data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2236%22 height=%2236%22 viewBox=%220 0 36 36%22%3E%3Cpath fill=%22%2334A853%22 d=%22M16 16v14h4V20z%22/%3E%3Cpath fill=%22%234285F4%22 d=%22M30 16H20l-4 4h14z%22/%3E%3Cpath fill=%22%23FBBC05%22 d=%22M6 16v4h10l4-4z%22/%3E%3Cpath fill=%22%23EA4335%22 d=%22M20 16V6h-4v14z%22/%3E%3Cpath fill=%22none%22 d=%22M0 0h36v36H0z%22/%3E%3C/svg%3E" />
                    <span>New</span>
                </button>
            </SidebarBtn>

            <SidebarOptions>
            <SidebarOption>
                    <MobileScreenShareIcon />
                    <span>My Drive</span>
                </SidebarOption>

                <SidebarOption>
                    <DevicesIcon />
                    <span>Computers</span>
                </SidebarOption>

                <SidebarOption>
                    <PeopleAltOutlinedIcon />
                    <span>Shared with me</span>
                </SidebarOption>

                <SidebarOption>
                    <QueryBuilderOutlinedIcon />
                    <span>Recent</span>
                </SidebarOption>

                <SidebarOption>
                    <StarBorderOutlinedIcon />
                    <span>Starred</span>
                </SidebarOption>

                <SidebarOption>
                    <DeleteOutlineOutlinedIcon />
                    <span>Trash</span>
                </SidebarOption>
                
            <SidebarOption>
                    <CloudQueueIcon />
                    <span>Storage</span>
                </SidebarOption>

                <div className="progress_bar">
                    <progress size="tiny" value="50" max="100" />
                    <span>105 GB  of 200 GB used</span>
                </div>
            </SidebarOptions>
        </SidebarContainer>
        </>
    )
}
export default Sidebar