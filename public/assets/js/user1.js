//页面加载时获取用户列表渲染到页面
$.ajax({
    type:'get',
    url:'/users',
    success:function(response) {
        var html = template('userTpl',{data:response})
        // console.log(html);
        $('#userBox').html(html)
    }
})

//添加用户
//当表单发成提交事件的时候拦截发送请求
$('#userForm').on('submit',function() {
    //获取到表单中带name属性的控件的值
    var formData = $(this).serialize();
    // console.log(formData);
    $.ajax({
        type:'post',
        url:'/users',
        data: formData,
        success:function(response) {
            console.log(response);
            // 刷新页面
            location.reload();
        },
        error:function() {
            alert('用户添加失败')
        }
    })
    //阻止表单默认的提交行为
    return false;
})

//添加头像
//当用户选择文件的时候
$('#modifyBox').on('change','#avatar',function() {
    //实例化一个formData构造函数
    var formData = new FormData();
    //this.files是获取到上传文件的信息  是一个数组
    formData.append('avatar',this.files[0]);

    $.ajax({
        type:'post',
        url:'/upload',
        data:formData,
        // 告诉$.ajax方法不要解析请求参数
        processData: false,
        // 告诉$.ajax方法不要设置请求头
        contentType: false,
        success:function(response) {
            console.log(response);
            //获取到标签的src属性  修改为服务端传输回来的值
            $('#preview').attr('src',response[0].avatar)
            //创建新用户的时候把头像信息也上传
            //创建一个隐藏域，用来存储上传头像的路径
            $('#hiddenAvatar').val(response[0].avatar)
        }
    })
})

//修改表单信息
//为修改按钮绑定点击事件
$('#userBox').on('click','.edit',function() {
    //获取在编辑按钮上的自定义属性
    var id = $(this).attr('data-id');
    //发送请求
    $.ajax({
        type:'get',
        url:'/users/' + id,
        success:function(response) {
            console.log(response);
            var html = template('modifyTpl',response)
            // console.log(html);
            $('#modifyBox').html(html)
        }
    })
})

//修改内容
$('#modifyBox').on('submit','#modifyForm',function() {
    var formData = $(this).serialize();
    // console.log(formData);
    var id = $(this).attr('data-id');
    $.ajax({
        type:'put',
        url:'/users/' + id,
        data: formData,
        success:function(response) {
            // console.log(response);
            location.reload()
        }
    })
    return false;
})