$(document).ready(function () {
    var $chooser = $("#stylechooser");
    var $container = $("#slideContainer");

    var mode = "cube";
    


    $("#slideContainer").ctMpress({
        mode: mode
    }).bind("show", function (e, id) {
                if (id == "#portfolio") {
                    launchQuicksand();
                    loadAndLaunchThickbox();
                }
            });

    $("#menu a").click(function () {
        $(this).closest(".nav-collapse").collapse('hide');

        return false;
    });

});


function launchQuicksand() {
    yepnope([
        {
            load: ["js/jquery.easing.js", "js/jquery.quicksand.js"],
            complete: function (url, result, key) {
                /*** Quicksand ***/
                var p = $('#portfolios1');
                var f = $('.filterPortfolio');


                var data = p.clone();
                f.find('a').click(function () {
                    var link = $(this);
                    var li = link.parents('li');
                    if (li.hasClass('active')) {
                        return false;
                    }

                    f.find('li').removeClass('active');
                    li.addClass('active');


                    //quicksand
                    var filtered = li.data('filter') ? data.find('li[data-filter~="' + li.data('filter') + '"]') : data.find('li');

                    p.quicksand(filtered, {
                                duration: 800,
                                easing: 'easeInOutQuad'
                            }, function () { // callback function
                                launchThickbox(1);
                            });

                    return false;
                });
            }
        }
    ]);
}


function loadAndLaunchThickbox() {
    yepnope.injectCss("css/thickbox.css");

    yepnope([
        {
            load: ["js/thickbox.js"],
            complete: function (url, result, key) {
                launchThickbox(0);
            }
        }
    ]);
}

function launchThickbox(i) {

    // thickbox assign validation
    $("#portfolios1 a").addClass("thickbox").attr("rel", "set");

    if (i == 1) {
        tb_init('a.thickbox, area.thickbox, input.thickbox');//pass where to apply thickbox

    }
}
