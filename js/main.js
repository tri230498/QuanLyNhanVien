var employeeList = [];

document.getElementById("btnThemNV").onclick = createEmployee;
function createEmployee() {
  // lấy input
  var tknv = document.getElementById("tknv").value;
  var fullName = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var workDay = document.getElementById("datepicker").value;
  var basicSalary = document.getElementById("luongCB").value;
  var position = document.getElementById("chucvu").value;
  var workTime = document.getElementById("gioLam").value;

  // Gọi tới hàm validation để check form có hợp lệ không
  var isValid = validation();
  if (!isValid) {
    return alert("Vui lòng kiểm tra giá trị của các input");
  }

  // Kiểm tra tài khoản employee

  var foundIndex = findByAc(tknv);
  if (foundIndex !== -1) {
    return alert("Tài khoản này đã bị trùng!");
  }

  // tạo 1 employee mới

  var newEmployee = new Employee(
    tknv,
    fullName,
    email,
    password,
    workDay,
    basicSalary,
    position,
    workTime
  );

  //push newEmployee add  employeeList
  employeeList.push(newEmployee);

  console.log(employeeList);

  //render Table
  renderTable();

  // lưu localStorage
  saveData();
  // reset
  reset();
}

//-----Hàm reset-----
function reset() {
  location.reload();
}

//-----Hàm render table-----

function renderTable(data) {
  if (!data || data[""]) {
    data = employeeList;
  }
  // console.log(data);
  var html = "";
  for (var i = 0; i < data.length; i++) {
    var currentEmployee = data[i];
    // console.log(currentEmployee);
    html += `<tr>
            <td>${currentEmployee.tknv}</td>
            <td>${currentEmployee.fullName}</td>
            <td>${currentEmployee.email}</td>
            <td>${dayjs(currentEmployee.workDay).format("MM/DD/YYYY")}</td>
            <td>${currentEmployee.position}</td>        
            <td>${currentEmployee.totalSalary()}</td>
            <td>${currentEmployee.employeeType()}</td> 
                      
            <td><button class="btn btn-danger" onclick="deleteEmployee('${
              currentEmployee.tknv
            }')">Xóa<buton>

            <button class="btn btn-info" onclick="getEmployeeInfo('${
              currentEmployee.tknv
            }')">Cập nhật<buton></td>

            </tr>`;
  }
  document.getElementById("tableDanhSach").innerHTML = html;
}

//-----Hàm saveData-----
function saveData() {
  localStorage.setItem("list", JSON.stringify(employeeList));
}

//-----Hàm get data từ localStorage-----
function getData() {
  var employeeListStr = localStorage.getItem("list");
  console.log(JSON.parse(employeeListStr));
  if (!employeeListStr) return;
  employeeList = mapData(JSON.parse(employeeListStr));

  renderTable();
}

getData();

//-----mapdata (local) => data moi-----
function mapData(dataFromLocal) {
  var mappedData = [];
  for (var i = 0; i < dataFromLocal.length; i++) {
    var item = dataFromLocal[i];
    // console.log(item);
    var newEmployee = new Employee(
      item.tknv,
      item.fullName,
      item.email,
      item.password,
      item.workDay,
      item.basicSalary,
      item.position,
      item.workTime
    );
    mappedData.push(newEmployee);
    // console.log(mappedData);
  }
  // console.log( mappedData)
  return mappedData;
}

//-----Hàm tìm employee-----

function findByAc(tknv) {
  // tìm employee trong employeeList => index
  // -1

  for (var i = 0; i < employeeList.length; i++) {
    if (employeeList[i].tknv === tknv) {
      return i;
    }
  }

  return -1;
}

//-----Hàm deleteEmployee-----
function deleteEmployee(tknv) {
  var index = findByAc(tknv);

  if (index === -1) {
    alert("Id không hợp lệ!");
    return;
  }

  employeeList.splice(index, 1);

  renderTable();

  saveData();
}

//-----Hàm tìm employeeType tuyến tính-----
function findEmployee() {
  var result = [];

  // 1. lấy keywork
  var keyword = document
    .getElementById("searchName")
    .value.toLowerCase()
    .trim();

  // 2. duyệt employeeList, kiểm tra từng sinh viên

  for (var i = 0; i < employeeList.length; i++) {
    var currentEmployee = employeeList[i];
    console.log(currentEmployee);
    if (currentEmployee.employeeType().toLowerCase().includes(keyword)) {
      result.push(currentEmployee);
      
    }
  }
  
  console.log(result);
  
  renderTable(result)
}

//-----phần 1: Hàm update: Lấy info của employee muốn update show up form-----
function getEmployeeInfo(tknv) {
  var index = findByAc(tknv);

  if (index === -1) {
    alert("Id không hợp lệ!");
    return;
  }

  var foundEmployee = employeeList[index];

  document.getElementById("tknv").value = foundEmployee.tknv;
  document.getElementById("name").value = foundEmployee.fullName;
  document.getElementById("email").value = foundEmployee.email;
  document.getElementById("password").value = foundEmployee.password;
  document.getElementById("datepicker").value = foundEmployee.workDay;
  document.getElementById("luongCB").value = foundEmployee.basicSalary;
  document.getElementById("chucvu").value = foundEmployee.position;
  document.getElementById("gioLam").value = foundEmployee.workTime;

  document.getElementById("btnThemNV").style.display = "none";
  document.getElementById("btnThem").click();
}

//-----phần 2 Người dùng sửa sại thông tin trên form, nhấn lưu thay đổi => cập nhật-----
document.getElementById("btnCapNhat").onclick = updateEmployee;
function updateEmployee() {
  // lấy dữ liệu từ input
  var tknv = document.getElementById("tknv").value;
  var fullName = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var workDay = document.getElementById("datepicker").value;
  var basicSalary = document.getElementById("luongCB").value;
  var position = document.getElementById("chucvu").value;
  var workTime = document.getElementById("gioLam").value;

  // tknv => tìm vị trí => cập nhật từng filed
  var index = findByAc(tknv);

  if (index === -1) {
    alert("Id không hợp lệ!");
    return;
  }

  var foundEmployee = employeeList[index];

  foundEmployee.fullName = fullName;
  foundEmployee.email = email;
  foundEmployee.password = password;
  foundEmployee.workDay = workDay;
  foundEmployee.basicSalary = basicSalary;
  foundEmployee.position = position;
  foundEmployee.workTime = workTime;

  renderTable();

  saveData();

  alert("Cập nhật thành công!");

  document.getElementById("btnThemNV").style.display = "block";
  document.getElementById("btnThem").click();

  reset();
}

//-----kiểm tra validation-----

function validation() {
  var isValid = document.getElementById("formQLNV").checkValidity();
  // kiểm tra các input bên trong form có hợp lệ không input nào có required thì mới được kiểm tra

  if (!isValid) {
    // DOM tới input tknv và kiểm tra hợp lệ
    var inpTknv = document.getElementById("tknv");
    var spanTknv = document.getElementById("tbTKNV");

    if (inpTknv.validity.valueMissing) {
      //input đang bị lỗi required => true
      spanTknv.style.display = "block";
      spanTknv.innerHTML = "Tài khoản không được để trống!";
    } else if (inpTknv.validity.tooLong || inpTknv.validity.tooShort) {
      // Input đang bị lỗi maxlength or minlength => true
      spanTknv.style.display = "block";
      spanTknv.innerHTML = "Tài khoản nhân viên phải từ 4 đến 6 ký số!";
    } else {
      //Input không còn lỗi
      spanTknv.innerHTML = "";
    }

    // DOM tới input name và kiểm tra hợp lệ
    var inpName = document.getElementById("name");
    var spanName = document.getElementById("tbTen");

    if (inpName.validity.valueMissing) {
      //input đang bị lỗi required => true
      spanName.style.display = "block";
      spanName.innerHTML = "Tên nhân viên không được để trống!";
    } else if (inpName.validity.patternMismatch) {
      spanName.style.display = "block";
      spanName.innerHTML = "Không được nhập số!";
    } else {
      spanName.innerHTML = "";
    }

    // DOM tới input email và kiểm tra hợp lệ
    var inpEmail = document.getElementById("email");
    var spanEmail = document.getElementById("tbEmail");

    if (inpEmail.validity.valueMissing) {
      //input đang bị lỗi required => true
      spanEmail.style.display = "block";
      spanEmail.innerHTML = "Email không được để trống!";
    } else if (inpEmail.validity.patternMismatch) {
      spanEmail.style.display = "block";
      spanEmail.innerHTML = "Email không đúng định dạng!";
    } else {
      spanEmail.innerHTML = "";
    }

    // DOM tới input password và kiểm tra hợp lệ
    var inpPassWord = document.getElementById("password");
    var spanPassWord = document.getElementById("tbMatKhau");

    if (inpPassWord.validity.valueMissing) {
      //input đang bị lỗi required => true
      spanPassWord.style.display = "block";
      spanPassWord.innerHTML = "PassWord không được để trống!";
    } else if (inpPassWord.validity.patternMismatch) {
      spanPassWord.style.display = "block";
      spanPassWord.innerHTML =
        "PassWord  6-10 ký tự (chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt)!";
    } else {
      spanPassWord.innerHTML = "";
    }

    // DOM tới input datepicker và kiểm tra hợp lệ
    var inpDate = document.getElementById("datepicker");
    var spanDate = document.getElementById("tbNgay");

    if (inpDate.validity.valueMissing) {
      //input đang bị lỗi required => true
      spanDate.style.display = "block";
      spanDate.innerHTML = "Ngày tháng năm không được để trống!";
    } else if (inpDate.validity.typeMismatch) {
      spanDate.style.display = "block";
      spanDate.innerHTML = "Phải đúng định dạng mm/dd/yyyy!";
    } else {
      spanDate.innerHTML = "";
    }

    // DOM tới input luongCB và kiểm tra hợp lệ
    var inpSalary = document.getElementById("luongCB");
    var spanSalary = document.getElementById("tbLuongCB");

    if (inpSalary.validity.valueMissing) {
      //input đang bị lỗi required => true
      spanSalary.style.display = "block";
      spanSalary.innerHTML = "Lương không được để trống!";
    } else if (
      inpSalary.validity.rangeUnderflow ||
      inpSalary.validity.rangeOverflow
    ) {
      spanSalary.style.display = "block";
      spanSalary.innerHTML = "Phải đúng định lương cơ bản!";
    } else {
      spanSalary.innerHTML = "";
    }

    // DOM tới input chucvu và kiểm tra hợp lệ
    var inpPosition = document.getElementById("chucvu");
    var spanPosition = document.getElementById("tbChucVu");

    if (inpPosition.validity.valueMissing) {
      //input đang bị lỗi required => true
      spanPosition.style.display = "block";
      spanPosition.innerHTML = "Chức vụ không được để trống!";
    } else {
      spanPosition.innerHTML = "";
    }

    // DOM tới input gioLam và kiểm tra hợp lệ
    var inpTime = document.getElementById("gioLam");
    var spanTime = document.getElementById("tbGiolam");

    if (inpTime.validity.valueMissing) {
      //input đang bị lỗi required => true
      spanTime.style.display = "block";
      spanTime.innerHTML = "Giờ làm không được để trống!";
    } else if (
      inpTime.validity.rangeUnderflow ||
      inpTime.validity.rangeOverflow
    ) {
      spanTime.style.display = "block";
      spanTime.innerHTML = "Số giờ làm trong tháng 80 - 200 giờ";
    } else {
      spanTime.innerHTML = "";
    }
  }

  return isValid;
}
