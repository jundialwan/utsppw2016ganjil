$(document).ready(function() {
    // you could do something at the time ajax request started
    $(document).ajaxStart(function() {
        console.log('ajax dimulai');
    });

    // you could do something at the time ajax request stopped
    $(document).ajaxStop(function() {
        console.log('ajax selesai');
    });
        
    $('#login-form').submit(function(event) {
        event.preventDefault();

        $.ajax({
            url: 'services/cv.php',
            type: 'POST',
            dataType: 'json',
            data: {'perintah': 'login', 'user': $('input[name=username]').val(), 'password': $('input[name=password]').val()},
        })
        .done(function(r) {
            var result = JSON.parse(JSON.stringify(r));

            if (result['status'] == 'gagal')
            {                
                alert('Login gagal. Username dan Password tidak cocok.');
            }
            else
            {                
                alert('Login Sukses. Redirect ke halaman profile.');

                // set web storage as login session
                window.sessionStorage.nama = result['nama'];
                window.sessionStorage.npm = result['user'];

                // redirect to home.html page
                window.location = 'home.html';
            }
        })
        .fail(function() {
            alert('Terjadi kesalahan pada sistem. Silakan muat ulang halaman ini.')
        });        
    });
});