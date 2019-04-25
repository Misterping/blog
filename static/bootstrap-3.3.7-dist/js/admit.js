var listitems=$('.list-item')
var rightwrap=$('.right-wrap')
listitems.on('click',function(){
    listitems.removeClass('active')
    var tag=$(this).attr('data-wrap')
    rightwrap.removeClass('active')
    $("#"+tag).addClass('active')
    $(this).addClass('active')
})
