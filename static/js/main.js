console.log("JS good to go, sir!");

$('.put-form').on('submit', function(e) {
    e.preventDefault();
    var element = $(this);
    var url = element.attr('action');
    var formData = element.serialize();
    $.ajax({
        method: 'PUT',
        url: url,
        data: formData
    }).done(function(data) {
        // get data returned from the PUT route
        console.log(data);

        // refresh the page we're on using GET to display the item details.
        window.location = url;
    });
});

$('.delete-link').on('click', function(e) {
    e.preventDefault();
    var element = $(this);
    var url = element.attr('href');
    $.ajax({
        method: 'DELETE',
        url: url
    }).done(function(data) {
        // get data returned from the DELETE route
        console.log(data);

        // go back to the homepage after deleting anything.
        window.location = '/';
    });
});
