<?php
	class User{
		protected $isLogged = false;									//czy zalogowany
		protected $idUser;												//jego id
		protected $accType;												//typ konta (CUSTOMER, DOCTOR)
		protected $firstName;
		protected $lastName;
		protected $email;
		protected $address;
		protected $phoneNumber;
		protected $db;													//połącznie z baza
		
		protected function __construct($id,$accT,$db){					//kostruktur pobiera id, typ konta i połączenie
			$this->idUser=$id;
			$this->accType=$accT;
			$this->isLogged=true;										//jesli sie udało to zmienia, ze zalogowany
			$this->db=$db;
		}
		
		public function checkIsLogged(){								//zwraca czy zalogowany
			if($this->isLogged)
				return true;
			else
				return false;
		}

		public function getFirstName(){
			return $this->firstName;
		}

		public function getLastName(){
			return $this->lastName;
		}

		public function getEmail(){
			return $this->email;
		}
		
		public function getPhoneNumber(){
			return $this->phoneNumber;
		}
		
		public function getAddress(){
			return $this->address;
		}

		public function getUserID(){
			return $this->isUser;
		}

		public function getAccType(){
			return $this->accType;
		}

	}

?>