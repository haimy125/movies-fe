import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../../../assets/styles/Admin.css";
import AdminHeader from "../../../../components/AdminHeader/AdminHeader";
import AdminNav from "../../../../components/AdminNav/AdminNav";
import { useAuth } from "../../../../services/authService";
import Loader from "../../../../components/Loader/Loader";
import "./MovieEdit.css";
import { convertMillisecondsToDate } from "../../../../helper/FormatHelper";
const MovieEdit = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    vn_name: "",
    cn_name: "",
    description: "",
    user_add: "", // Assuming a default user ID, you can change this as needed
    author: "",
    episode_number: "",
    status: "Đang ra",
    new_movie: "",
    hot_movie: "",
    vip_movie: "",
    price: "",
    image: null,
    year: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  const [categorymovie, setCategorymovie] = useState([]);
  const [scheduleListmovie, setScheduleListmovie] = useState([]);
  const [movie, setmovie] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchInit();
  }, []);

  const fetchInit = async () => {
    setLoading(true);
    await fetchData();
    await fetchDetail();
    await fetchDetailcategory();
    await fetchDataSchedule();
    await fetchImageFromDatabase();
    await fetchDetailSchedules();
    setLoading(false);
  };

  const fetchData = async () => {
    try {
      const rp = await axios.get(
        `http://localhost:1412/admin/category/all?page=1&limit=10000`
      );
      setCategoryList(rp.data.listResult);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchDetailcategory = async () => {
    try {
      const rp = await axios.get(
        `http://localhost:1412/api/category_movie/getBymovie/${id}`
      );
      const categoryIds = rp.data.map((item) => item.category.id);
      setSelectedCategories(categoryIds);
      setCategorymovie(rp.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchDetailSchedules = async () => {
    try {
      const rp = await axios.get(
        `http://localhost:1412/api/admin/schedule-movie/getbymovie/${id}`
      );
      const scheduleIds = rp.data.map((item) => item.schedule.id);
      setSelectedSchedules(scheduleIds);
      setScheduleListmovie(rp.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchDataSchedule = async () => {
    try {
      const rp = await axios.get(
        `http://localhost:1412/api/admin/schedule/getAll`
      );
      setScheduleList(rp.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchDetail = async () => {
    try {
      const rp = await axios.get(
        `http://localhost:1412/api/admin/movies/getbyid/${id}`
      );
      const data = rp?.data;
      console.log("data: ", data);
      setFormData({
        vn_name: data.vnName,
        cn_name: data.cnName,
        description: data.description,
        user_add: "", // Assuming a default user ID, you can change this as needed
        author: data.author,
        episode_number: data.episodeNumber,
        status: data.status,
        new_movie: data.newMovie,
        hot_movie: data.hotMovie,
        vip_movie: data.vipMovie,
        price: data.price,
        image: null,
        year: data.year,
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const fetchImageFromDatabase = async () => {
    try {
      const response = await axios.get(
        `http://localhost:1412/api/admin/movies/view/${id}`,
        {
          responseType: "arraybuffer", // Để nhận dữ liệu nhị phân
        }
      );
      const base64Image = Buffer.from(response.data, "binary").toString(
        "base64"
      );
      const imageBlob = new Blob([base64Image], { type: "image/jpeg" }); // Thay đổi type phù hợp với hình ảnh của bạn
      setFormData({
        ...formData,
        image: imageBlob,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "image") {
      if (files && files?.length > 0) {
        setFormData({
          ...formData,
          [name]: files[0],
        });
        setFileName(files[0]);
        setSelectedImage(URL.createObjectURL(files[0]));
      } else if (name === "vip_movie") {
        setFormData({
          ...formData,
          [name]: value,
          price: value === "false" ? 0 : formData.price,
        });
      } else {
        setFormData({
          ...formData,
          [name]: null,
        });
        setFileName(null);
        setSelectedImage(`http://localhost:1412/api/admin/movies/view/${id}`);
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleCategoryChange = (e, id) => {
    if (e.target.checked) {
      setSelectedCategories([...selectedCategories, id]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((categoryId) => categoryId !== id)
      );
    }
  };
  const handleScheduleChange = (e, id) => {
    if (e.target.checked) {
      setSelectedSchedules([...selectedSchedules, id]);
    } else {
      setSelectedSchedules(
        selectedSchedules.filter((scheduleid) => scheduleid !== id)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const scheduleIdString = selectedSchedules.join(",");
    const categoryIdsString = selectedCategories.join(",");
    const dataToSubmit = new FormData();
    dataToSubmit.append("vn_name", formData.vn_name);
    dataToSubmit.append("cn_name", formData.cn_name);
    dataToSubmit.append("description", formData.description);
    dataToSubmit.append("user_add", user.id);
    dataToSubmit.append("author", formData.author);
    dataToSubmit.append("episode_number", formData.episode_number);
    dataToSubmit.append("status", formData.status);
    dataToSubmit.append("new_movie", formData.new_movie);
    dataToSubmit.append("hot_movie", formData.hot_movie);
    dataToSubmit.append("vip_movie", formData.vip_movie);
    dataToSubmit.append("price", formData.price);
    dataToSubmit.append("year", formData.year);
    dataToSubmit.append("categorylist", categoryIdsString);
    dataToSubmit.append("schedulelist", scheduleIdString);
    if (fileName) {
      dataToSubmit.append("image", formData.image);
    }

    try {
      const response = await axios.put(
        `http://localhost:1412/api/admin/movies/update/${id}`,
        dataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setNotification("Cập nhật thành công!");
      alert("Cập nhật phim thành công!");
      navigate("/admin/movie");
      console.log(response.data);
    } catch (error) {
      setError(error.response ? error.response.data : "Error submitting form");
      console.error("Error submitting form:", error);
    }
  };

  console.log(formData);
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="admin_layout">
      <div className="header_ad">
        <AdminHeader />
      </div>
      <div className="content">
        <div className="nav">
          <div className="content_nav">
            <AdminNav />
          </div>
        </div>
        <div className="content_data">
          <div className="label_list">
            <h2>Cập nhật thông tin phim</h2>
            <Link to="/admin/movie" className="backtolist">
              {" "}
              Quay lại{" "}
            </Link>
          </div>

          <div className="create_movie_font">
            {notification && <p style={{ color: "green" }}>{notification}</p>}
            <form onSubmit={handleSubmit} className="create_movie_form">
              <div className="form_group">
                <label>Tên Việt Nam</label>
                <input
                  type="text"
                  name="vn_name"
                  className="create_input"
                  placeholder="Nhập tên tiếng việt của phim"
                  value={formData.vn_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form_group">
                <label>Tên tiếng nước ngoài</label>
                <input
                  type="text"
                  name="cn_name"
                  className="create_input"
                  placeholder="Nhập tên nước ngoài của phim"
                  value={formData.cn_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form_group">
                <label>Tác giả</label>
                <input
                  type="text"
                  name="author"
                  className="create_input"
                  placeholder="Nhập tên tác giả của phim"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form_group">
                <label>Số tập</label>
                <input
                  type="number"
                  name="episode_number"
                  className="create_input"
                  placeholder="Nhập số tập của phim"
                  value={formData.episode_number}
                  onChange={handleChange}
                  required
                  min={1}
                  max={5000}
                />
              </div>
              <div className="form_group">
                <label>Năm sản xuất</label>
                <input
                  type="number"
                  name="year"
                  className="create_input"
                  placeholder="Nhập năm xản xuất"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  min={1900}
                  max={new Date().getFullYear()}
                />
              </div>
              <div className="form_group">
                <label>Trạng thái</label>
                <select
                  className="create_input"
                  name="status"
                  defaultValue={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Đang ra">Đang ra</option>
                  <option value="Tạm hoãn">Tạm hoãn</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                </select>
              </div>
              <div className="form_group">
                <label>Phim mới</label>
                <select
                  className="create_input"
                  name="new_movie"
                  defaultValue={formData.new_movie}
                  onChange={handleChange}
                  required
                >
                  <option value={true}>Phim mới ra</option>
                  <option value={false}>Phim đã ra lâu</option>
                </select>
              </div>
              <div className="form_group">
                <label>Phim hot</label>
                <select
                  className="create_input"
                  name="hot_movie"
                  defaultValue={formData.hot_movie}
                  onChange={handleChange}
                  required
                >
                  <option value={true}>Phim đang nổi</option>
                  <option value={false}>Phim thường</option>
                </select>
              </div>
              <div className="form_group">
                <label>Loại phí</label>
                <select
                  className="create_input"
                  name="vip_movie"
                  defaultValue={formData.vip_movie}
                  onChange={handleChange}
                  required
                >
                  <option value={true}>Trả phí</option>
                  <option value={false}>Miễn phí</option>
                </select>
              </div>
              <div className="form_group">
                <label>Giá</label>
                <input
                  type="number"
                  name="price"
                  className="create_input"
                  placeholder="Nhập giá của phim"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  disabled={
                    formData.vip_movie === "false" ||
                    formData.vip_movie === false
                  }
                />
              </div>
              <div className="form_group">
                <label>Nội dung chính</label>
                <textarea
                  type="text"
                  name="description"
                  className="create_textarea"
                  placeholder="Nhập nội dung chính của phim"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <label>Thể loại</label>
              <div className="category_movie_list">
                {categoryList.map((item, index) => (
                  <div className="category_movie_list_group" key={index}>
                    <input
                      type="checkbox"
                      checked={(selectedCategories ?? []).includes(item.id)}
                      onChange={(e) => handleCategoryChange(e, item.id)}
                    />
                    <label>{item.name}</label>
                  </div>
                ))}
              </div>
              <label>Lịch chiếu</label>
              <div className="category_movie_list">
                {scheduleList.map((item, index) => (
                  <div className="category_movie_list_group" key={index}>
                    <input
                      type="checkbox"
                      checked={(selectedSchedules ?? []).includes(item.id)}
                      onChange={(e) => handleScheduleChange(e, item.id)}
                    />
                    <label>{item.name}</label>
                  </div>
                ))}
              </div>
              <div className="form_group">
                <label>Chọn ảnh bìa cho phim</label>
                <input
                  type="file"
                  id="movieFile"
                  name="image"
                  className="custom-file-input"
                  onChange={handleChange}
                />
                <label className="custom-file-label" htmlFor="movieFile">
                  Chọn ảnh
                </label>
              </div>
              {selectedImage ? (
                <div className="form_group image_movie">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="selected_image"
                  />
                </div>
              ) : (
                <div className="form_group image_movie">
                  <img
                    src={`http://localhost:1412/api/admin/movies/view/${id}`}
                    alt="Selected"
                    className="selected_image"
                  />
                </div>
              )}
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button className="create_button" type="submit">
                Cập nhật phim
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieEdit;
