# Hướng dẫn cấu hình kết nối MCP trên Antigravity (Đa nền tảng)

Tài liệu này hướng dẫn cách cấu hình máy chủ MCP (Model Context Protocol) cho Figma trên ứng dụng Antigravity cho mọi thiết bị (Windows, macOS, Linux).

## 1. Đường dẫn tệp cấu hình của Antigravity
Cấu hình các MCP server được lưu trữ tại:
- **Windows:** `C:\Users\<Tên_User_Của_Bạn>\.gemini\config\mcp_config.json`
- **macOS / Linux:** `~/.gemini/config/mcp_config.json`

---

## 2. Hướng dẫn cấu hình cho hệ điều hành WINDOWS

### Bước 1: Cài đặt gói `figma-developer-mcp` ở chế độ toàn cục (global)
Mở PowerShell hoặc Command Prompt và chạy lệnh:
```bash
npm install -g figma-developer-mcp
```

### Bước 2: Cấu hình tệp `mcp_config.json`
Mở tệp cấu hình của bạn và dán nội dung sau vào:

```json
{
  "mcpServers": {
    "figma": {
      "command": "C:\\Users\\<Tên_User_Của_Bạn>\\AppData\\Roaming\\npm\\figma-developer-mcp.cmd",
      "args": ["--stdio"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "FIGMA_PERSONAL_ACCESS_TOKEN_CỦA_BẠN",
        "FIGMA_API_KEY": "FIGMA_PERSONAL_ACCESS_TOKEN_CỦA_BẠN"
      }
    }
  }
}
```

*Lưu ý:*
- Thay thế `<Tên_User_Của_Bạn>` bằng tên tài khoản đăng nhập Windows thực tế của thiết bị đó (ví dụ: `Vuong Ngoc Thuan` hoặc `Administrator`).
- Giữ nguyên các dấu gạch chéo ngược kép (`\\`) trong đường dẫn.
- Thay thế `FIGMA_PERSONAL_ACCESS_TOKEN_CỦA_BẠN` bằng mã Token cá nhân tạo từ Figma.

---

## 3. Hướng dẫn cấu hình cho hệ điều hành macOS / LINUX

### Bước 1: Cài đặt gói `figma-developer-mcp` ở chế độ toàn cục (global)
Mở Terminal và chạy lệnh:
```bash
npm install -g figma-developer-mcp
```

### Bước 2: Cấu hình tệp `mcp_config.json`
Mở tệp cấu hình của bạn và dán nội dung sau vào:

```json
{
  "mcpServers": {
    "figma": {
      "command": "figma-developer-mcp",
      "args": ["--stdio"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "FIGMA_PERSONAL_ACCESS_TOKEN_CỦA_BẠN",
        "FIGMA_API_KEY": "FIGMA_PERSONAL_ACCESS_TOKEN_CỦA_BẠN"
      }
    }
  }
}
```

*Lưu ý:*
- Trên macOS và Linux, sau khi cài đặt global, bạn thường có thể gọi trực tiếp lệnh `"figma-developer-mcp"` mà không cần điền đường dẫn tuyệt đối.
- Nếu gặp lỗi không tìm thấy lệnh, hãy thay thế bằng đường dẫn tuyệt đối nơi npm cài đặt global package (thường là `/usr/local/bin/figma-developer-mcp` hoặc `/usr/bin/figma-developer-mcp`).

---

## 4. Cách áp dụng cấu hình sau khi sửa
1. Mở ứng dụng **Antigravity**.
2. Truy cập vào mục **Customizations**.
3. Nhấp vào nút **Refresh** 🔄 (bên cạnh nút "Add MCP +") hoặc khởi động lại ứng dụng để hệ thống nhận cấu hình mới. Chấm đỏ cạnh chữ `figma` sẽ chuyển sang màu xanh lá cây khi kết nối thành công.
