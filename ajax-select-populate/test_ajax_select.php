<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<!-- Import for Bootstrap, ajax, jQuery -->
	<link rel="stylesheet" href="testing/css/bootstrap3.36.min.css">
	<script src="testing/js/jquery.1.12.min.js"></script>
	<script type="text/javascript" src="testing/js/jquery-ui.1.9.2.js"></script>
	<link rel="stylesheet" type="text/css" href="testing/css/jquery-ui1.9.2.css">
	<script src="testing/js/bootstrap3.36.min.js"></script>

	<script type="text/javascript" src="testing/js/jquery.validate.js"></script>
	<link rel="stylesheet" type="text/css" href="https://webapps.sctcc.edu/tools/Styles.css">

	<script type="text/javascript">
		$(document).ready(function(){
			$('#test_select').change(function(){
				var id = $(this).val();

				$.ajax({
					method: "GET",
					url: "testAjaxFunctions.php?action=show_new_select&id="+id
				}).success(function(data){
					$("#dynamic_select").html(data);
				});
			});


		});
	</script>
</head>
<body>
<div class="panel panel-default">
	<div class="panel-body">
		<?php
			include('testing/Helper.php');

			$h = new Helper();
			$h->input_bootstrap = 1;

			try {
				$dsn = 'mysql:host=localhost;dbname=placement';
				$username = 'root';
				$password = '';

				$dbh = new PDO($dsn, $username, $password);
			} catch(PDOException $e) {
				echo "Could not connect; error: " . $e->getMessage();
			}

			$h->display_select(array('input_name'=>'test_select', 'label_name'=>'First Select'), return_all_names($dbh), return_all_values($dbh));
		?>
		<div id="dynamic_select"></div>
	</div>
</div>
</body>
</html>

<?php
function return_all_names($dbh){
	$sql = "SELECT add_id, first_name, last_name FROM application";
	$sth = $dbh->prepare($sql);
	$sth->execute();

	$name_array = array();

	foreach($sth as $row){
		array_push($name_array, $row['first_name'] . ' ' . $row['last_name']);
	}

	return $name_array;
}
	function return_all_values($dbh){
		$sql = "SELECT add_id, first_name, last_name FROM application";
		$sth = $dbh->prepare($sql);
		$sth->execute();

		$value_array = array();

		foreach($sth as $row){
			array_push($value_array, $row['add_id']);
		}

		return $value_array;
	}