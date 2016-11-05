<?php
	//don't edit this file
	
   $perintah=$_REQUEST["perintah"];

   switch($perintah) {

      case "login" : $ret=login($_REQUEST['user'],$_REQUEST['password']);
                     echo $ret;
                     break;
      case "cari" : $ret=cari($_REQUEST['nama']);
                     echo $ret;
                     break;
      case "tambah" : $ret=tambah($_REQUEST['user'],$_REQUEST['userteman']);
                     echo $ret;
                     break;
      case "teman" : $ret=teman($_REQUEST['user']);
                     echo $ret;
                     break;

   }

   function getUser($user) {
      $tmp=file("user.txt");
      if ($user=='') return false;
      foreach($tmp as $baris) {
          $ar=explode(";",$baris);
          if (trim($ar[0])==$user) {
              return trim($ar[1]);
          } 
      }
      return false;

   }

   function login($user, $password) {
      $tmp=file("user.txt");
      if ($user!=$password) return '{"status":"gagal"}';
      $nama=getUser($user);
      if ($nama) return '{"status":"ok","user":"'.$user.'","nama":"'.$nama.'"}';
      else  return '{"status":"gagal"}';
   }

   function cari($nama) {
      $tmp=file("user.txt");
      $hasil='';
      foreach($tmp as $baris) {
          $ar=explode(";",$baris);
          if (stristr($baris,$nama)) {
              $hasil.=(($hasil!=''?',':'').'{"user":"'.$ar[0].'","nama":"'.trim($ar[1]).'"}');
          }
      }
      return '{"users":['.$hasil.']}';
   }

   function tambah($user,$userteman) {
      if (!getUser($user)) return '{"status":"gagal"}';
      else {
         $ret=getUser($userteman);
         if ($ret) {
            $tmp=fopen("teman.txt","r");
			$content = fgets($tmp);
			$input = ($content==""?"":"\n");
			fclose($tmp);
			
			$tmp=fopen("teman.txt","a");
						
			$input = $input.$user.";".$userteman.";".$ret;
            fwrite($tmp, $input);
            return '{"status":"ok"}';
         } else return '{"status":"gagal"}';
      }
   }

   function teman($user) {
      $tmp=file("teman.txt");
      $hasil='';
      foreach($tmp as $baris) {
          $ar=explode(";",$baris);
          if ($ar[0]==$user) {
              $hasil.=(($hasil!=''?',':'').'{"user":"'.$ar[1].'","nama":"'.trim($ar[2]).'"}');
          }
      }
      return '{"users":['.$hasil.']}';
   }


?>
