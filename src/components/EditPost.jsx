import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { colourOptions, colourStyles } from "./Select";
import Select from "react-select";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import { authService, storageService } from "../firebase/firebase";
import { useRecoilValue } from "recoil";
import { hospitalData } from "../share/atom";
import { useMutation, useQuery } from "react-query";

const Container = styled.div``;
const FormWrap = styled.form`
  /* display: flex; */
  /* flex-direction: column; */
  align-items: center;
  padding: 50px;
`;

const ImageBox = styled.label`
  display: flex;
  justify-content: center;
  border-radius: 100%;
  overflow: hidden;
  cursor: pointer;
  width: 150px;
  height: 150px;
  margin: auto;
  > img {
    width: 100%;
    height: 100%;
    text-align: center;
    object-fit: cover;
  }
`;

const PostImage = styled.img`
  border: 0.1px solid lightgray;
  border-radius: 100%;
  object-fit: cover;
`;

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const TitleBox = styled.textarea`
  margin: 10px 0;
  padding: 8px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid gray;
  resize: none;
`;

const ContentBox = styled.textarea`
  margin: 10px 0;
  padding: 8px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid gray;
  resize: none;
`;

const TotalCostBox = styled.textarea`
  margin: 10px 0;
  padding: 8px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid gray;
  resize: none;
`;

const CreatePostButton = styled.button`
  margin: 10px 0;
  padding: 8px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  background-color: lightgray;
  cursor: pointer;
  float: right;
`;
const StarRating = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  margin-bottom: 20px;
`;

const PostSelect = styled.div`
  margin-bottom: 30px;
`;

const NewPost = ({ postEdit, setPostEdit }) => {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [starRating, setStarRating] = useState(0);
  const [selectvalue, setSelectValue] = useState([]);
  const [editTitle, setEditTitle] = useState("");
  const [editContents, setEditContents] = useState("");
  const [editTotalCost, setEditTotalCost] = useState("");
  const [editRatings, setEditRatings] = useState("");
  const [editSelectValue, setEditSelectValue] = useState([]);

  const router = useRouter();

  const placesData = useRecoilValue(hospitalData);
  console.log(placesData);

  // 별점 만들기
  const starArray = Array.from({ length: 5 }, (_, i) => i + 1);

  const Star = ({ selected, onClick }) => (
    <div
      style={{
        color: selected ? "#ffc107" : "#e4e5e9",
      }}
      onClick={onClick}
    >
      <span style={{ fontSize: "40px" }}>&#9733;</span>
    </div>
  );

  // 게시글 업데이트
  const { mutate: updateMutate } = useMutation(
    (data) =>
      axios
        .put(`http://localhost:3001/posts/${data.id}`, data)
        .then((res) => res.data),
    {
      onSuccess: () => {
        setEditTitle("");
        setEditContents("");
        refetch();
      },
    },
  );

  const handleEditSubmit = async (
    e,
    id,
    downloadUrl,
    selectedColors,
    rating,
    totalCost,
    isEdit,
    profileImage,
    date,
    displayName,
    userId,
  ) => {
    // e.preventDefault();
    updateMutate({
      id,
      title: editTitle,
      contents: editContents,
      downloadUrl,
      selectedColors: editSelectValue,
      rating: editRatings,
      totalCost,
      isEdit,
      profileImage,
      date,
      displayName,
      userId,
    });
  };

  // 이미지 업로드(이미지를 로컬에 임시 저장)
  const uploadPhoto = async (event) => {
    // event.preventDefault();
    try {
      const theFile = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(theFile); // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.

      reader.onloadend = (finishedEvent) => {
        // 파일리더가 파일객체를 data URL로 변환 작업을 끝났을 때
        const contentimgDataUrl = finishedEvent.currentTarget.result;
        localStorage.setItem("newProfilePhoto", contentimgDataUrl);
        document.getElementById("preview-photo").src = contentimgDataUrl; //useref 사용해서 DOM에 직접 접근 하지 말기
      };
    } catch (error) {
      console.error(error);
    }
  };

  const ChangePhoto = async (event) => {
    event.preventDefault();
    // 변경할 이미지를 올리면 데이터 url로 로컬 스토리지에 임시 저장이 되는데
    // 그 값 가져와서 firestore에 업로드
    try {
      let newPhoto = localStorage.getItem("newProfilePhoto");
      const imgRef = ref(storageService, `${Date.now()}`);

      let downloadUrl;
      if (newPhoto) {
        const response = await uploadString(imgRef, newPhoto, "data_url");
        downloadUrl = await getDownloadURL(response.ref);
      }
      if (downloadUrl) {
        handleEditSubmit(downloadUrl);
        setPostEdit(false);
      } else if (downloadUrl === undefined) {
        // 새로운 사진이 없으면 리턴
        alert("새로운 사진이없습니다");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Container>
        <FormWrap
          onSubmit={(e) => {
            ChangePhoto(
              e,
              id,
              downloadUrl,
              selectedColors,
              rating,
              totalCost,
              isEdit,
              profileImage,
              date,
              displayName,
              userId,
            );
          }}
        >
          <ImageBox htmlFor="file">
            <PostImage
              id="preview-photo"
              src="https://media.istockphoto.com/id/1248723171/vector/camera-photo-upload-icon-on-isolated-white-background-eps-10-vector.jpg?s=612x612&w=0&k=20&c=e-OBJ2jbB-W_vfEwNCip4PW4DqhHGXYMtC3K_mzOac0="
              alt="게시글사진"
            />
          </ImageBox>
          <input
            id="file"
            type="file"
            style={{ display: "none" }}
            accept="images/*"
            onChange={uploadPhoto}
          />
          <InputWrap>
            <label htmlFor="title">제목쓰기</label>
            <TitleBox
              type="text"
              placeholder="Title"
              //   value={title}
              onChange={(event) => setEditTitle(event.target.value)}
              id="title"
              rows="1"
              maxLength="50"
            />
            <label htmlFor="title">글 작성</label>
            <ContentBox
              type="text"
              placeholder="Contents"
              //   value={contents}
              onChange={(event) => setEditContents(event.target.value)}
              rows="8"
              maxLength="500"
            />
            <label htmlFor="title">총 진료비</label>
            <TotalCostBox
              type="text"
              placeholder="TotalCost"
              //   value={totalCost}
              onChange={(event) => setEditTotalCost(event.target.value)}
              rows="3"
              maxLength="200"
            />
          </InputWrap>
          {/* <CreatePostButton type="submit">Create Post</CreatePostButton> */}
          <label htmlFor="title">별점남기기</label>
          <StarRating>
            {starArray.map((star) => (
              <Star
                key={star}
                selected={star <= editRatings}
                onClick={() => setEditRatings(star)}
              />
            ))}
          </StarRating>
          <label htmlFor="title">이 병원의 좋은점을 남겨주세요</label>
          <PostSelect>
            <Select
              //   value={selectvalue}
              onChange={(selectedOptions) =>
                setEditSelectValue(selectedOptions)
              }
              closeMenuOnSelect={false}
              defaultValue={[colourOptions[0], colourOptions[1]]}
              isMulti
              options={colourOptions}
              styles={colourStyles}
              instanceId="selectbox"
            />
          </PostSelect>
          <CreatePostButton>리뷰남기기</CreatePostButton>
        </FormWrap>
      </Container>
    </>
  );
};

export default NewPost;
