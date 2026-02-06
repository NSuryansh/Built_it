import React, { useState, useEffect } from "react";
import { 
  BookOpen, Video, Film, Gamepad2, Upload, 
  CheckCircle, AlertCircle, Loader2, Plus, Trash2, Edit2, X, RefreshCw 
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/doctor/Navbar";
import { checkAuth } from "../../utils/profile";

const DoctorContentManager = () => {
  const [activeTab, setActiveTab] = useState("articles"); 
  const [viewMode, setViewMode] = useState("list"); 
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [doctorToken, setDoctorToken] = useState(null);
  const [dataList, setDataList] = useState([]);

  const navigate = useNavigate();
  
  // ✅ FIX: Updated URL to match your server.js configuration (/api/doc)
  const backendUrl = "http://localhost:3000/api/doc";

  // Auth Check
  useEffect(() => {
    const verifyAuth = async () => {
      // Assuming "doc" is the role string used in your checkAuth function
      const authStatus = await checkAuth("doc");
      if (!authStatus) {
        navigate("/doctor/login"); // Adjust this route if your login path is different
      } else {
        // Retrieve the token. Ensure "token" is the key you use in localStorage
        const token = localStorage.getItem("token"); 
        setDoctorToken(token);
      }
    };
    verifyAuth();
  }, [navigate]);

  // Fetch data on tab/token change
  useEffect(() => {
    if (doctorToken) fetchData(activeTab);
  }, [activeTab, doctorToken]);

  // Forms
  const initialArticleState = { title: "", description: "", url: "", source: "", readTime: "", iconName: "Book" };
  const initialVideoState = { sectionTitle: "Meditation", title: "", description: "", youtubeUrl: "" };
  const initialEntState = { type: "MOVIE", category: "Top Picks", title: "", link: "", image: null, currentImageUrl: "" };

  const [articleForm, setArticleForm] = useState(initialArticleState);
  const [videoForm, setVideoForm] = useState(initialVideoState);
  const [entForm, setEntForm] = useState(initialEntState);

  // Helper for image preview
  const getPreviewUrl = () => {
    if (entForm.image) return URL.createObjectURL(entForm.image);
    return entForm.currentImageUrl;
  };

  const fetchData = async (tab) => {
    setFetching(true);
    try {
      let endpoint = "";
      if (tab === "articles") endpoint = "/get-articles";
      else if (tab === "videos") endpoint = "/get-videos";
      else if (tab === "entertainment") endpoint = "/get-entertainment";

      // console.log("Fetching from:", `${backendUrl}${endpoint}`); // Debug log

      const res = await axios.get(`${backendUrl}${endpoint}`);
      
      if (tab === "videos") {
        // Flatten videos for the list view since the API returns them grouped
        const flatVideos = res.data.flatMap(section => section.videos);
        setDataList(flatVideos);
      } else if (tab === "entertainment") {
         // Flatten entertainment object
         const flatEnt = [...res.data.movies, ...res.data.books, ...res.data.music, ...res.data.games];
         setDataList(flatEnt);
      } else {
        setDataList(res.data);
      }
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setFetching(false);
    }
  };

  const handleEdit = (item) => {
    setEditMode(true);
    setEditId(item.id);
    setViewMode("form");
    setMessage({ type: "", text: "" });

    if (activeTab === "articles") {
        setArticleForm({
            title: item.title, description: item.description, url: item.url, 
            source: item.source, readTime: item.readTime, iconName: item.iconName
        });
    } else if (activeTab === "videos") {
        setVideoForm({
            sectionTitle: item.sectionTitle, title: item.title, 
            description: item.description, youtubeUrl: item.youtubeUrl
        });
    } else if (activeTab === "entertainment") {
        setEntForm({
            type: item.type, category: item.category, title: item.title, 
            link: item.link, image: null, currentImageUrl: item.imageUrl
        });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
        let endpoint = "";
        if (activeTab === "articles") endpoint = `/delete-article/${id}`;
        else if (activeTab === "videos") endpoint = `/delete-video/${id}`;
        else endpoint = `/delete-entertainment/${id}`;

        await axios.delete(`${backendUrl}${endpoint}`, {
            headers: { Authorization: `Bearer ${doctorToken}` }
        });
        setMessage({ type: "success", text: "Item deleted successfully" });
        fetchData(activeTab);
    } catch (error) {
        setMessage({ type: "error", text: "Failed to delete item" });
    }
  };

  const resetForms = () => {
      setArticleForm(initialArticleState);
      setVideoForm(initialVideoState);
      setEntForm(initialEntState);
      setEditMode(false);
      setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const config = { headers: { Authorization: `Bearer ${doctorToken}` } };
      let endpoint = "";
      let method = editMode ? "put" : "post";
      let payload = {};

      if (activeTab === "articles") {
          endpoint = editMode ? `/update-article/${editId}` : "/add-article";
          payload = articleForm;
      } else if (activeTab === "videos") {
          endpoint = editMode ? `/update-video/${editId}` : "/add-video";
          payload = videoForm;
      } else if (activeTab === "entertainment") {
          endpoint = editMode ? `/update-entertainment/${editId}` : "/add-entertainment";
          const formData = new FormData();
          formData.append("type", entForm.type);
          formData.append("category", entForm.category);
          formData.append("title", entForm.title);
          formData.append("link", entForm.link);
          if (entForm.image) formData.append("image", entForm.image);
          
          payload = formData;
          config.headers["Content-Type"] = "multipart/form-data";
      }

      await axios[method](`${backendUrl}${endpoint}`, payload, config);
      setMessage({ type: "success", text: `Item ${editMode ? 'updated' : 'added'} successfully!` });
      resetForms();
      fetchData(activeTab);
      setViewMode("list");
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error.response?.data?.error || "Operation failed." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Resource Manager</h1>
                <p className="text-gray-600">Manage Stress & Entertainment Content</p>
            </div>
            <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-200 flex">
                <button onClick={() => { setViewMode("list"); resetForms(); }} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === "list" ? "bg-[var(--custom-orange-100)] text-[var(--custom-orange-700)]" : "text-gray-600 hover:bg-gray-50"}`}>
                    Manage List
                </button>
                <button onClick={() => { setViewMode("form"); resetForms(); }} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${viewMode === "form" ? "bg-[var(--custom-orange-600)] text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                    <Plus className="w-4 h-4" /> Add New
                </button>
            </div>
        </div>

        <div className="flex justify-center mb-8 border-b border-gray-200">
          <TabButton active={activeTab === "articles"} onClick={() => setActiveTab("articles")} icon={BookOpen} label="Articles" />
          <TabButton active={activeTab === "videos"} onClick={() => setActiveTab("videos")} icon={Video} label="Videos" />
          <TabButton active={activeTab === "entertainment"} onClick={() => setActiveTab("entertainment")} icon={Gamepad2} label="Entertainment" />
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        {viewMode === "list" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {fetching ? (
                    <div className="p-12 text-center text-gray-500"><RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />Loading items...</div>
                ) : dataList.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <p>No items found.</p>
                        <button onClick={() => setViewMode("form")} className="mt-4 text-[var(--custom-orange-600)] font-medium hover:underline">Create your first item</button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                                    <th className="p-4 font-semibold">Title</th>
                                    <th className="p-4 font-semibold">Details</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {dataList.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="p-4 font-medium text-gray-900">{item.title}</td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {activeTab === "articles" && item.source}
                                            {activeTab === "videos" && item.sectionTitle}
                                            {activeTab === "entertainment" && <span className="px-2 py-1 bg-gray-100 rounded text-xs">{item.type} • {item.category}</span>}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        )}

        {viewMode === "form" && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">{editMode ? `Edit ${activeTab.slice(0,-1)}` : `Add New ${activeTab.slice(0,-1)}`}</h2>
                    <button onClick={() => { setViewMode("list"); resetForms(); }} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {activeTab === "articles" && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Title" value={articleForm.title} onChange={(e) => setArticleForm({...articleForm, title: e.target.value})} />
                                <InputField label="Read Time" value={articleForm.readTime} onChange={(e) => setArticleForm({...articleForm, readTime: e.target.value})} placeholder="e.g. 5 min read" />
                                <InputField label="Source" value={articleForm.source} onChange={(e) => setArticleForm({...articleForm, source: e.target.value})} />
                                <SelectField label="Icon" value={articleForm.iconName} onChange={(e) => setArticleForm({...articleForm, iconName: e.target.value})} options={["Book", "Sun", "Brain", "Heart", "Headphones"]} />
                            </div>
                            <InputField label="URL" value={articleForm.url} onChange={(e) => setArticleForm({...articleForm, url: e.target.value})} />
                            <TextAreaField label="Description" value={articleForm.description} onChange={(e) => setArticleForm({...articleForm, description: e.target.value})} />
                        </>
                    )}
                    {activeTab === "videos" && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectField label="Section" value={videoForm.sectionTitle} onChange={(e) => setVideoForm({...videoForm, sectionTitle: e.target.value})} options={["Meditation", "Yoga", "Breathing", "Sleep"]} />
                                <InputField label="Title" value={videoForm.title} onChange={(e) => setVideoForm({...videoForm, title: e.target.value})} />
                            </div>
                            <InputField label="YouTube URL" value={videoForm.youtubeUrl} onChange={(e) => setVideoForm({...videoForm, youtubeUrl: e.target.value})} />
                            <TextAreaField label="Description" value={videoForm.description} onChange={(e) => setVideoForm({...videoForm, description: e.target.value})} />
                        </>
                    )}
                    {activeTab === "entertainment" && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectField label="Type" value={entForm.type} onChange={(e) => setEntForm({...entForm, type: e.target.value})} options={["MOVIE", "BOOK", "MUSIC", "GAME"]} />
                                <InputField label="Category" value={entForm.category} onChange={(e) => setEntForm({...entForm, category: e.target.value})} placeholder="e.g. Top Picks, Action" />
                                <InputField label="Title" value={entForm.title} onChange={(e) => setEntForm({...entForm, title: e.target.value})} />
                                <InputField label="Link" value={entForm.link} onChange={(e) => setEntForm({...entForm, link: e.target.value})} placeholder="External URL" />
                            </div>
                            
                            {/* FIXED IMAGE UPLOAD & PREVIEW */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
                                <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={(e) => setEntForm({...entForm, image: e.target.files[0]})} />
                                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                    {getPreviewUrl() && (
                                        <img src={getPreviewUrl()} alt="Preview" className="h-40 w-auto mb-4 rounded-lg shadow-md object-cover" />
                                    )}
                                    <div className="p-3 bg-gray-100 rounded-full mb-2 text-gray-500"><Upload className="w-5 h-5" /></div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {entForm.image ? entForm.image.name : (editMode ? "Change Cover Image (Optional)" : "Click to Upload Cover Image")}
                                    </span>
                                </label>
                            </div>
                        </>
                    )}
                    <SubmitButton isLoading={isLoading} label={editMode ? "Update Item" : "Create Item"} />
                </form>
            </div>
        )}
      </div>
    </div>
  );
};

// Reusable Components
const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-4 border-b-2 text-sm font-medium transition-all ${active ? "border-[var(--custom-orange-500)] text-[var(--custom-orange-600)] bg-[var(--custom-orange-50)]" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
    <Icon className="w-4 h-4" /> {label}
  </button>
);
const InputField = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-xs uppercase tracking-wide font-semibold text-gray-500 mb-2">{label}</label>
    <input type="text" className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent outline-none transition-all" value={value} onChange={onChange} placeholder={placeholder} required />
  </div>
);
const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-xs uppercase tracking-wide font-semibold text-gray-500 mb-2">{label}</label>
    <select className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--custom-orange-500)] outline-none" value={value} onChange={onChange}>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);
const TextAreaField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs uppercase tracking-wide font-semibold text-gray-500 mb-2">{label}</label>
    <textarea className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--custom-orange-500)] outline-none min-h-[100px]" value={value} onChange={onChange} required />
  </div>
);
const SubmitButton = ({ isLoading, label }) => (
  <button type="submit" disabled={isLoading} className="w-full bg-[var(--custom-orange-600)] hover:bg-[var(--custom-orange-700)] text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />} {label}
  </button>
);

export default DoctorContentManager;