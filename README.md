# 3d_mri_nextjs_slicer


---

## **🚀 How to Run Everything (Without Docker)**  

### **1️⃣ Start the Backend (Flask API)**
#### **1. Install Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

#### **2. Run the Flask Backend**
```bash
python app.py
```
✅ **Runs on `http://localhost:5000`**  
✅ **Dynamically loads MRI images from the parent folder**  

---

### **2️⃣ Deploy Jupyter Notebook to Binder**
1. **Push your code to GitHub**  
2. **Open [MyBinder](https://mybinder.org/)**  
   - Enter your **GitHub Repository URL**  
   - Click **Launch**  
   - Copy the generated API URL (for MRI processing)  

---

### **3️⃣ Start the Frontend (Next.js)**
#### **1. Install Dependencies**
```bash
cd frontend
npm install
```

#### **2. Run the Frontend**
```bash
npm run dev
```
✅ **Runs on `http://localhost:3000`**  
✅ **Fetches MRI data from Flask & Binder**  
✅ **Visualizes MRI in 3D using XTK**  

---

### **4️⃣ Open the App in Your Browser**
Go to **`http://localhost:3000`** 🎉  
- **Next.js** fetches MRI scan data from **Flask (`http://localhost:5000`)**  
- **Binder processes MRI** and returns data  
- **XTK renders 3D MRI visualization**  

---

## **🔹 Summary (How it Works)**
1️⃣ **User opens Next.js frontend** (`http://localhost:3000`).  
2️⃣ **Frontend fetches MRI data** from Flask & Binder.  
3️⃣ **Backend (`app.py`) dynamically loads MRI images** from the parent folder.  
4️⃣ **Jupyter Notebook (Binder) processes the MRI scan**.  
5️⃣ **Next.js renders a 3D MRI visualization** using **XTK**.  

This setup is **fully functional without Docker**. Let me know if you need any adjustments! 🚀🔥