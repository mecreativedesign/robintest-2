// For users page
var usersModule = angular.module("usersApp", []);

usersModule.controller("usersCtrl", function ($scope, $window, $location, $sce) {
    
	$scope.users = [];
	$scope.form = {};
	$scope.itemNameStatus = false;
	$scope.itemCostStatus = false;

    $scope.submitForm =function(){

		$scope.form.userId = Math.floor(Math.random() * 9e15);
		
		$scope.form.status = 'Active';
		
		$scope.form.invoice_date_other = $scope.form.invoice_date.getMonth()+1+'/'+$scope.form.invoice_date.getDate()+'/'+$scope.form.invoice_date.getFullYear();
		
		$scope.form.invoice_due_date_other = $scope.form.invoice_due_date.getMonth()+1+'/'+$scope.form.invoice_due_date.getDate()+'/'+$scope.form.invoice_due_date.getFullYear();

		if($window.localStorage['users'] != undefined) {
			
			$scope.users = JSON.parse($window.localStorage['users']);
			
			var itemExist = false;

			_.map($scope.users, function(obj){
			  	if($scope.form.invoice_date.getTime() == new Date(obj.invoice_date).getTime()) {
		  			itemExist = true;
			  	}
			});
			
			if(itemExist==true) {
				alert('Item with same date alraedy exists');
				return false;
			}

			$scope.users.push($scope.form);
			
		} else {
			$scope.users.push($scope.form);
		}
		
		$window.localStorage['users'] = JSON.stringify($scope.users);
		
		alert('Added successfully!');
		
		window.location = "approvers.html";
    }

    $scope.updateFields = function(val){
    	if(val=='Product'){
    		$scope.itemNameStatus = false;
			$scope.itemCostStatus = false;
    	} else {
    		$scope.itemNameStatus = true;
			$scope.itemCostStatus = true;
			$scope.form.item_name = '';
			$scope.form.item_cost = '';
    	}
    }
});



// For approvers page
var approverModule = angular.module("approverApp", []);

approverModule.controller("approverCtrl", function ($scope, $window, $location, $sce) {

	$scope.users = [];
	$scope.query = {};
	
	$scope.selectedCheckboxes = [];

	$scope.loadData = function(){
		if($window.localStorage['users'] != undefined) {
			$scope.users = JSON.parse($window.localStorage['users']);
		}
	};

	$scope.changeStatus = function(id,status) {
    	$scope.getUsers = JSON.parse($window.localStorage['users']);
		
		_.map($scope.getUsers, function(obj){
		  	if(obj.userId==id) {
    			obj.status = status; // Or replace the whole obj
		  	}
		});
		$scope.users = $scope.getUsers;
		$window.localStorage['users'] = JSON.stringify($scope.users);
    };

    $scope.removeItem = function(id) {

    	$scope.getUsers = JSON.parse($window.localStorage['users']);
    	$scope.getUsers = _.without($scope.getUsers, _.findWhere($scope.getUsers, {userId: id}));
    	$scope.users = $scope.getUsers;
		$window.localStorage['users'] = JSON.stringify($scope.users);
    };

 	$scope.checkAll = function () {

        angular.forEach($scope.users, function (item) {
            item.selected = true;
        });
    };

	$scope.changeStatusBulk = function(status){
		var ids = [];
		_.map($scope.users, function(obj){
		  	if(obj.selected) {
    			ids.push(obj.userId);
		  	}
		});

		if(ids.length>0) {
			$scope.getUsers = JSON.parse($window.localStorage['users']);
			_.map($scope.getUsers, function(obj){
				for(var i=0;i<=ids.length;i++){
				  	if(obj.userId==ids[i]) {
		    			obj.status = status; // Or replace the whole obj
				  	}
			  	}

			});

			$scope.users = $scope.getUsers;
			$window.localStorage['users'] = JSON.stringify($scope.users);
		} else{
			alert('Please select all items');
			return;
		}
	}

	$scope.removeItemBulk = function() {
		
		var ids = [];
		
		_.map($scope.users, function(obj){
		  	if(obj.selected) {
    			ids.push(obj.userId);
		  	}
		});
		if(ids.length>0){
			$window.localStorage.removeItem('users');
			$scope.users = [];
		} else {
			alert('Please select all items');
			return;
		}

    };
});



// For edit user page
var editUserModule = angular.module("editUserApp", []);

editUserModule.controller("editUserCtrl", function ($scope, $window, $location, $sce) {
	
	var urlParams = new URLSearchParams(window.location.search);

    var id = parseInt(urlParams.get('id'));
	$scope.form = {};
	$scope.itemNameStatus = false;
	$scope.itemCostStatus = false;

	$scope.editUser =function(){
		$scope.getUsers = JSON.parse($window.localStorage['users']);
		$scope.form = _.findWhere($scope.getUsers, {userId: id});
		$scope.updateFields($scope.form.invoice_line_items);
	}

	$scope.updateUser =function(){
		
		$scope.getUsers = JSON.parse($window.localStorage['users']);
    	$scope.getUsers = _.without($scope.getUsers, _.findWhere($scope.getUsers, {userId: id}));
    	$scope.getUsers.push($scope.form);
		$window.localStorage['users'] = JSON.stringify($scope.getUsers);
		alert('Updated successfully!');
		window.location = "approvers.html";
	}

	$scope.updateFields = function(val){
    	if(val=='Product'){
    		$scope.itemNameStatus = false;
			$scope.itemCostStatus = false;

    	} else {
    		$scope.itemNameStatus = true;
			$scope.itemCostStatus = true;
			$scope.form.item_name = '';
			$scope.form.item_cost = '';
    	}
    }

});

editUserModule.directive("formatDate", function() {
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, modelCtrl) {
            modelCtrl.$formatters.push(function(modelValue) {
                if (modelValue){
                    return new Date(modelValue);
                }
                else {
                    return null;
                }
            });
        }
    };
});
