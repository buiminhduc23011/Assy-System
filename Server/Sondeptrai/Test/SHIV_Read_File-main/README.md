## Package ############## 		
npm i express	    
npm i socket.io		    
npm i nodemon       
npm i mssql     	    
npm i bcryptjs      
npm i dotenv	    
npm i log4js    
npm i socket.io-client		    
npm i path		    
npm i ejs       
npm i ejs-mate   
npm i multer   
npm i mssql      
npm i lru-cache    
npm i jquery    
npm i bootstrap@4.6.0   
npm i jquery.easing     
npm i datatables    
npm i datatables.net-bs4    
npm i @fortawesome/fontawesome-free     
npm i moment    
npm i cors      
npm i axios     
npm i os        
## Package CMD Windows ##           
npm i express socket.io nodemon mssql bcryptjs dotenv log4js socket.io-client path ejs ejs-mate multer mssql lru-cache jquery bootstrap@4.6.0 jquery.easing datatables datatables.net-bs4 @fortawesome/fontawesome-free moment cors axios os            
## Start Project ######## 		
B1: package.json -> scripts -> start -> "nodemon app.js"        
B2: npm start	
## Structure ############ 	
app            : Lưu trữ logic hệ thống.            
app.channels   : Lưu trữ các kênh sự kiện socket.          
app.controllers: Lưu trữ logic, các function xử lý.         
app.models     : Nơi kết nối với cơ sở dữ liệu.          
config         : Lưu trữ các file cấu hình hệ thống như: log, route....         
enums          : Lưu trữ các file quy ước dạng dữ liệu          
helpers        : Lưu trữ các file hỗ trợ như: file biến toàn cục, convert dữ liệu...            
public         : Lưu trữ file css, js, font...           
queue          : Lưu trữ các job khi khởi tạo hệ thống, các công việc chạy ẩn...                           	
resources      : Lưu trữ file ejs, giao diện hệ thống.            
routes         : Lưu trữ đường dẫn, api, static.         
services       : Cấu hình kết nối DB, route.       
storage        : Lưu trữ log hệ thống.          

## Permission ##########
start_plan: Bắt Đầu KHSX        
stop_plan: Dừng KHSX        
end_plan: Kết Thúc KHSX         
setup_plan: Setup KHSX      
check_cross_plan: Check Chéo KHSX       
quality_product: Chọn Loại NG(QC sản phẩm)          
"# SHIV_Read_File" 
