//Someone doesn't want to learn XMLHttpRequest and uses this relic
$('form').on('submit' , (e) => {
    e.preventDefault();

    const email = $('#email').val().trim();
    const subject = $('#subject').val().trim();
    const text = $('#text').val().trim();

    data = {
        email,
        subject,
        text
    };

    $.post('/email',data,function() {
        console.log('Server recieved our data');
    });
});