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

	$action = $_GET['action'];
	$id = $_GET['id'];

	if($action == 'show_new_select'){
		$sql = "SELECT * FROM application WHERE add_id = :add_id";
		$sth = $dbh->prepare($sql);
		$sth->bindParam(':add_id', $id);
		$sth->execute();

		$h->display_select(array('input_name'=>'test_select_new', 'label_name'=>'Dynamic-loaded Select list'), $sth->fetch(PDO::FETCH_ASSOC));
	}