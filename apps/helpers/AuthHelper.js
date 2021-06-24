const db = require('../configs/database');

/*  
    get role for check role
    parameter role from table user_groups
    use if(AuthHelp.role('admin')) 
*/
exports.role = (role) => {
    db.connect((err)=> {
        roleQuery = 'select * from roles where role = ?';
        db.query(roleQuery,[role],(error,result,fields) => {
            if(error) throw error;
            if(result.length > 0){
                if(result[0].role === role){
                    return result[0].id;
                }
            }else{  
                return false;
            }
        });
    });
}