function alert(type, msg){
    var _alert = '';
    switch(type)
    {
        case 1:
            _alert = '<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong>' + msg + '</div>'
        break;
        case 2:
            _alert = '<div class="alert alert-info"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Info!</strong>' + msg + '</div>'
            break;
        case 3:
            _alert = '<div class="alert alert-warning"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Warning!</strong>' + msg + '</div>'
            break;
        case 4:
            _alert = '<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Danger!</strong>' + msg + '</div>'
            break;
        default :
            _alert =''
            break;
    }
    return _alert;
};


function displayMsg(type, msg){
        $('#alertMsg').html(alert(type, msg));
};
