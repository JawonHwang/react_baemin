import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Write.module.css';
import axios from 'axios';
import ReactQuill from './ReactQuill';
import { LoginContext } from '../../App';
import { MemberContext } from '../Bm/Bm';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import { FileUpload } from 'primereact/fileupload';

function Write() {
  const { member } = useContext(MemberContext);

  const [photo, setBoard] = useState({});
  const [files, setFiles] = useState([]);
  const navi = useNavigate();
  const { loginID } = useContext(LoginContext);

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleBack = () => {
    navi(-1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBoard((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles(Array.from(selectedFiles));
  };

  const handleAdd = () => {

    if (!photo.photoTitle) {
      alert("제목을 입력하세요.");
      return;
    }
    const trimContent = photo.photoContents.trim();
    if (!trimContent) {
      alert("내용을 입력하세요.");
      return;
    }

    const formData = new FormData();
    formData.append('photoWriter', loginID);
    formData.append('photoTitle', photo.photoTitle);
    formData.append('photoContents', trimContent);

    files.forEach((file) => {
      formData.append(`files`, file);
    });

    axios
      .post('/api/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((resp) => {
        navi('/baemin/community/photo');
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div className="photoContainer">
      <div className={style.write}>COMMUNITY - 글쓰기</div>
      <hr></hr>
      <div className={style.margin}>
        제목
        <input
          type="text"
          placeholder="제목"
          name="photoTitle"
          onChange={handleChange}
          value={photo.photoTitle}
          className={style.title}
        />
        <br />
        <hr></hr>
        <div className={style.fileList}>
          파일 첨부
          <Button
            sx={{ width: '10%', marginLeft: '29px' }}
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload
            <input
              type="file"
              onChange={handleFileChange}
              className={style.file}
              style={{ display: 'none' }}
              multiple
            />
          </Button>
          <List
            sx={{ width: '50%', bgcolor: 'background.paper', marginLeft: "30px" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton onClick={handleClick}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="업로드 파일 목록" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {files.length > 0 && (
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <FolderIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          {files.map((file, index) => (
                            <ListItemButton key={index} sx={{ pl: 4 }}>
                              <ListItemText primary={file.name} />
                            </ListItemButton>
                          ))}
                        </React.Fragment>
                      }
                    />
                  </ListItemButton>
                )}
              </List>
            </Collapse>
          </List>
        </div>
      </div>
      <hr></hr>
      <div>
        <div className={style.margin2}>
          내용
        </div>
        <div className={style.editor}>
          <ReactQuill id="editor" value={photo.photoContents} setValue={(value) => setBoard({ ...photo, photoContents: value })} style={{ height: "325px", width: "100%" }} />
        </div>
        <hr></hr>
        <div className={style.btn}>
          <button onClick={handleBack}>취소</button>
          <button onClick={handleAdd}>등록</button>
        </div>
      </div>
    </div>
  );
}

export default Write;
