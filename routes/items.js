var express = require('express')
var app = express()

// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM item_info ORDER BY item_id DESC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('item/list', {
					title: 'Items List', 
					data: ''
				})
			} else {
				// render to views/user/list.ejs template file
				res.render('item/list', {
					title: 'item List', 
					data: rows
				})
			}
		})
	})
})

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('item/add', {
		title: '새상품 추가',
		item_name: '',
		item_model: '',
		item_BIP: '',
		item_QIB: '',
		item_BoxWeight:	''	
	})
})

// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){	
	req.assert('item_name', '상품명을 작성해주세요').notEmpty()
	req.assert('item_model', '모델명을 작성해주세요').notEmpty()
	req.assert('item_BIP', '파레트당 박스 적재량을 작성해주세요').notEmpty()
	req.assert('item_QIB', '박스당 입수량을 작성해주세요').notEmpty()
	req.assert('item_BoxWeight', '박스당 무게를 작성해주세요').notEmpty()

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var item = {
			item_name: req.sanitize('item_name').escape().trim(),
			item_model: req.sanitize('item_model').escape().trim(),
			item_BIP: req.sanitize('item_BIP').escape().trim(),
			item_QIB: req.sanitize('item_QIB').escape().trim(),
			item_BoxWeight: req.sanitize('item_BoxWeight').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO item_info SET ?', item, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('item/add', {
						title: '새상품 추가',
						item_name: item.item_name,
						item_model: item.item_model,
						item_BIP: item.item_BIP,
						item_QIB: item.item_QIB,
						item_BoxWeight:	item.item_BoxWeight	
					})
				} else {				
					req.flash('success', 'Data added successfully!')
					
					// render to views/user/add.ejs
					res.render('item/add', {
						title: '새상품 추가',
						item_name: item.item_name,
						item_model: item.item_model,
						item_BIP: item.item_BIP,
						item_QIB: item.item_QIB,
						item_BoxWeight:	item.item_BoxWeight						
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('item/add', { 
            title: '새상품 추가',
			item_name: req.body.item_name,
			item_model: req.body.item_model,
			item_BIP: req.body.item_BIP,
			item_QIB: req.body.item_QIB,
			item_BoxWeight:	req.body.item_BoxWeight	
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM users WHERE id = ?', [req.params.id], function(err, rows, fields) {
			if(err) throw err
			
			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'User not found with id = ' + req.params.id)
				res.redirect('/users')
			}
			else { // if user found
				// render to views/user/edit.ejs template file
				res.render('user/edit', {
					title: 'Edit User', 
					//data: rows[0],
					id: rows[0].id,
					name: rows[0].name,
					age: rows[0].age,
					email: rows[0].email					
				})
			}			
		})
	})
})

// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('age', 'Age is required').notEmpty()             //Validate age
    req.assert('email', 'A valid email is required').isEmail()  //Validate email

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			name: req.sanitize('name').escape().trim(),
			age: req.sanitize('age').escape().trim(),
			email: req.sanitize('email').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('user/edit', {
						title: 'Edit User',
						id: req.params.id,
						name: req.body.name,
						age: req.body.age,
						email: req.body.email
					})
				} else {
					req.flash('success', 'Data updated successfully!')
					
					// render to views/user/add.ejs
					res.render('user/edit', {
						title: 'Edit User',
						id: req.params.id,
						name: req.body.name,
						age: req.body.age,
						email: req.body.email
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/edit', { 
            title: 'Edit User',            
			id: req.params.id, 
			name: req.body.name,
			age: req.body.age,
			email: req.body.email
        })
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {
	var user = { id: req.params.id }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM users WHERE id = ' + req.params.id, user, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to users list page
				res.redirect('/users')
			} else {
				req.flash('success', 'User deleted successfully! id = ' + req.params.id)
				// redirect to users list page
				res.redirect('/users')
			}
		})
	})
})

module.exports = app
