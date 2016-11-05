$(document).ready(function() {    
    // get teman and dislpay it on list
    getTeman();
    $('#profile-name').text(window.sessionStorage.nama);

    $('#logout-btn').click(function(event) {
        // prevent the link to execute
        event.preventDefault();
        
        // clear session storage
        window.sessionStorage.clear();

        // redirect to index.html
        window.location = 'index.html';
    });

    $('#update-profile').click(function(event) {                        
        var update = $('fieldset[name="update-field"]');
        update.toggleClass('hide');

        if (update.hasClass('hide')) 
        {
            $('#update-profile').html('update');
        }
        else
        {                        
            $('#name-input').val($.trim($('#profile-name').html()));
            $('#address-input').val($.trim($('#profile-address').html()));
            $('#education-input').val($.trim($('#profile-education').html()));

            $('#update-profile').html('done update');
        }
    });

    $('#name-input').on('change keyup paste click input', function() {                
        $('#profile-name').html($('#name-input').val());
    });

    $('#address-input').on('change keyup paste click input', function() {                
        $('#profile-address').html($('#address-input').val());
    });

    $('#education-input').on('change keyup paste click input', function() {                
        $('#profile-education').html($('#education-input').val());
    });


    // #cari button click event handler
    $('#cari').click(function(event) {
        $('#searchresult').html('');

        $.ajax({
            url: 'services/cv.php',
            type: 'POST',
            dataType: 'json',
            data: {'perintah': 'cari', 'nama': $('#npmQuery').val()},
        })
        .done(function(r) {
            var result = JSON.parse(JSON.stringify(r));

            // check if result exist
            if (result['users'].length) 
            {
                var returnStr = '<ul>';

                // append the user to list
                for (var i = 0; i < result['users'].length; i++) 
                {
                    var user = result['users'][i];
                    returnStr += '<li><input id="'+user['user']+'" class="connect-btn" type="button" value="connect"/>&nbsp;&nbsp;&nbsp;'+user['nama']+'</li>';
                };

                // embed all the list to search result container
                $('#searchresult').html(returnStr+'</ul>');
            }
            else
            {
                // oops, no user found for that parameter
                $('#searchresult').html('<b>User tidak ditemukan</b>');
            }

            // redirect page to #serachresult anchor in the same page after search complete
            window.location = '#searchresult';
        })
        .fail(function() {
            alert('Terjadi kesalahan pada sistem. Silakan muat ulang halaman ini.')
        });        
    });
    
    // onclick event handler
    // what's different between .click(function(){}) and .on('click', '#selector' function(){})?
    // see more here: http://stackoverflow.com/questions/9122078/difference-between-onclick-vs-click
    $(document).on('click', '.connect-btn', function(event) {                
        $.ajax({
            url: 'services/cv.php',
            type: 'POST',
            dataType: 'json',
            data: {'perintah': 'tambah', 'user': window.sessionStorage.npm, 'userteman': $(this)[0].id},
        })
        .done(function(r) {
            var result = JSON.parse(JSON.stringify(r));

            if (result['status'] == 'ok') 
            {
                alert('User berhasil ditambahkan ke daftar teman');

                // refresh teman list in the page after add teman
                getTeman();
            }
            else
            {
                alert('Gagal menambahkan teman. Silakan muat ulang halaman dan klik tombol connect kembali.');
            }
        })
        .fail(function() {
            alert('Terjadi kesalahan pada sistem. Silakan muat ulang halaman ini.')
        });        
    }); 

    // get teman list
    function getTeman()
    {
        $('#teman-list').html('');

        $.ajax({
            url: 'services/cv.php',
            type: 'POST',
            dataType: 'json',
            data: {'perintah': 'teman', 'user': window.sessionStorage.npm},
        })
        .done(function(r) {
            var result = JSON.parse(JSON.stringify(r));

            // check if result exist
            if (result['users'].length) 
            {
                var returnStr = '';

                for (var i = 0; i < result['users'].length; i++) 
                {
                    var user = result['users'][i];
                    returnStr += '<li>'+user['user']+' '+user['nama']+'</li>';
                };

                $('#teman-list').html(returnStr);
            }
            else
            {
                $('#teman-list').html('<b>Belum memiliki teman</b>');
            }
        })
        .fail(function() {
            alert('Terjadi kesalahan pada sistem. Silakan muat ulang halaman ini.')
        });
    }
});