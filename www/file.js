/** JS SamsonCMS Select field interaction */
var SamsonCMS_InputUpload = function(field)
{
    /** Delete file handler */
    s('.__deletefield', field).click(function(btn) {
        // Flag for preventing bubbling delete event
        btn.deleting = false;

        // If we are not deleting right now - ask confirmation
        if (!btn.deleting && confirm('Удалить файл?')) {
            // Get input field block
            var parent = btn.parent('.__inputfield');

            // Flag for disabling delete event
            btn.deleting = true;

            // Create loader
            var loader = new Loader(parent.parent(), {type: 'absolute', top: 1, left: 1});
            loader.show();

            // Perform ajax file delete
            s.ajax(btn.a('href'), function()
            {
                // Upload field is became empty
                parent.addClass('empty');

                // Remove loader
                loader.remove();

                // Enable delete button for future
                btn.deleting = false;

                // Clear upload file value
                s('.__input', parent).val('');
                s('.__input', parent).show();

                s('.__file_name', parent).hide();
                s('.__delete', parent).hide();
                btn.hide();
                showImage();
            });
        }

    },true, true);

    // File selected event
    uploadFileHandler(s('input[type="file"]', field), {
        start : function() {
            field.parent().css('padding', '0');
            s('.__input', field).hide();
            s('.__progress_bar',field).show();
            s('.__progress_bar p',field).css('width', "0%");
            s('.__progress_text', field).css('display', 'block');
        },
        response : function(response) {
            response = JSON.parse(response);
            if (response.status == 1) {
                s('.__progress_text', field).css('display', 'none');
                s('.__progress_bar',field).hide();
                field.parent().css('padding', '5px 10px');
                s('.__deletefield', field).show();
                s('.__file_name', field).show();
                s('.__file_name', field).html(response.path);
                showImage(response.path);
            }
        },
        error: function(){
            field.parent().css('padding', '5px 10px');
            s('.__progress_bar p',field).css('display', "none");
            s('.__input', field).css('display', 'block');
            s('.__progress_text', field).css('display', 'none');
        }
    });

    showImage(s('.__file_name', field).html());

    function showImage(newImage){
        var imageContainer = s('.__field_upload_image', field.parent());
        var image = s('.__fileImage', field.parent());
        if (newImage) {
            if (newImage.match(/\.(jpeg|jpg|gif|png)$/) != null) {
                image.a('src', newImage);
                image.parent().a('href', newImage);
                image.show();
                image.load(function(){
                    var height = parseInt(image.css('max-height'));
                    height = image.height() > height ? height : image.height();
                    imageContainer.height(height);
                    var width = parseInt(image.css('max-width'));
                    width = image.width() > width ? width : image.width();
                    imageContainer.width(width);
                });
            }
        } else {
            image.hide();
            imageContainer.height(0);
        }
    }

    s('.__fileImage', field.parent()).lightbox();
};

// Bind input
SamsonCMS_Input.bind(SamsonCMS_InputUpload, '.__fieldUpload');