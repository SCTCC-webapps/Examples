<?php
	/**
	 *
	 * This class is to help all the different applications have uniformity and be consistent. (atleast portions of it)
	 *
	 */
	class form_layout_helper extends Helper
	{
		public $program_name = '';
		public $program_length = '';

		//Holds all items we are unsetting in $_POST (items that won't be going into each programs specific tables, just in the general application table.
		public $blacklist_array = array(
			'middle_name',
			'maiden_name',
			'info_session',
			'agreement',
			'na_option',
			'pre_req_option',
			'cpr_option',
			'da_option'
		);

		//This function is to layout our basic contact information form. Anything else you need to put under it you can, and just finish it off with an <hr /> in the main script.
		public function display_contact_info_form(){
			echo
			"
				<p class=\"lead text-center\">Contact information</p>


				<div class=\"col-sm-12\">
					<div class=\"form-group\">
						<label for=\"first_name\" class=\"control-label col-sm-3\">Name:</label>";
			$this->label_width = 0;
			echo "<div class='col-sm-3 padded-inline'>"; $this->display_text(array('input_name'=>'first_name', 'placeholder'=>'First')); echo "</div>";
			echo "<div class='col-sm-2 padded-inline'>"; $this->display_text(array('input_name'=>'middle_name', 'placeholder'=>'Middle')); echo "</div>";
			echo "<div class='col-sm-3 padded-inline'>"; $this->display_text(array('input_name'=>'last_name', 'placeholder'=>'Last')); echo "</div>";
			echo"
					</div>
					<div class='form-group'>
						<label for=\"maiden_name\" class=\"control-label col-sm-3\">Maiden or Previous Last Name:</label>";
			echo "<div class='col-sm-3'>"; $this->display_text(array('input_name'=>'maiden_name', 'placeholder'=>'Maiden')); echo "</div>";
			echo"
					</div>
					<div class=\"form-group\">
						<label for=\"address\" class=\"control-label col-sm-3\">Address:</label>";
			echo "<div class='col-sm-8'>"; $this->display_text(array('input_name'=>'address', 'placeholder'=>'Street address')); echo "</div>";
			echo"
					</div>
					<div class=\"form-group\">
						<div class=\"col-sm-3\"></div>";
			echo "<div class='col-sm-3 col-md-3 padded-inline'>"; $this->display_text(array('input_name'=>'city', 'placeholder'=>'City'));  echo "</div>";
			echo "<div class='col-sm-3 col-md-3 padded-inline'>"; $this->display_select(array('input_name'=>'state', 'selected'=>'Minnesota'), $this->get_state_names(), $this->get_state_values()); echo "</div>";
			echo "<div class='col-sm-2 padded-inline'>"; $this->display_text(array('input_name'=>'zip', 'placeholder'=>'Zip', 'maxlength'=>10)); echo "</div>";
			echo"
					</div>
					<div class=\"form-group\">
						<label for=\"cell_phone\" class=\"control-label col-sm-3\">Cell Phone:</label>";
			echo "<div class='col-sm-3'>"; $this->display_text(array('input_name'=>'cell_phone', 'placeholder'=>'(###)-###-####')); echo "</div>";
			echo"
					</div>
					<div class=\"form-group\">
						<label for=\"phone\" class=\"control-label col-sm-3\">Home Phone:</label>";
			echo "<div class='col-sm-3'>"; $this->display_text(array('input_name'=>'phone', 'placeholder'=>'(###)-###-####')); echo "</div>";
			echo"
					</div>
					<div class=\"form-group\">
						<label for=\"email\" class=\"control-label col-sm-3\">Email Address:</label>";
			echo "<div class='col-sm-3'>"; $this->display_text(array('input_name'=>'email')); echo "</div>";
			echo"<p class=\"col-sm-4\"><em>This email will be used for all correspondence regarding this application.</em></p>
					</div>";
			if($this->program_name == 'Biomedical'){
					echo"
					<div class=\"form-group\">
						<label class=\"col-sm-3 control-label\" for=\"current_student\">SCTCC Student:</label>";
						echo "<div class='col-sm-4'>";
						$this->display_radio(array('input_name'=>'current_student', 'radio_name'=>'current_student', 'input_value'=>'1', 'label_name'=>'Yes'));
						$this->display_radio(array('input_name'=>'current_student', 'radio_name'=>'current_student', 'input_value'=>'0', 'label_name'=>'No'));
						echo "</div>
      		</div>";
      		}
			echo"
					<div class=\"form-group\">
						<label for=\"tech_id\" class=\"control-label col-sm-3\">SCTCC Tech ID:</label>";
			echo "<div class='col-sm-3'>"; $this->display_text(array('input_name'=>'tech_id', 'placeholder'=>'8 digits')); echo "</div>";
			echo"
					</div>
				</div><!-- End of top form formatting div -->";

			if($this->program_name){
				echo "
					<!-- Info session -->
					<div class=\"form-group\">
						<label class=\"col-sm-6 control-label\" for=\"info_session\">Have you attended an information session for the ".$this->program_name." Program?</label>";
				echo "<div class='col-sm-6'>";
				$this->display_radio(array('input_name' => 'info_session', 'radio_name' => 'info_session', 'input_value' => '1', 'label_name' => 'Yes'));
				$this->display_radio(array('input_name' => 'info_session', 'radio_name' => 'info_session', 'input_value' => '0', 'label_name' => 'No', 'checked' => 1));
				echo "</div>";
				echo "
					</div>
					<p>It is highly recommended that all students interested in the ".$this->program_name." program attend an information session. Dates and times can be found on the SCTCC website homepage under the Info Session tab.</p>
					<!-- /Info Session -->
				";
			}
		}

		//Displaying math requirement (accuplacer)
		public function display_math_req(){
			echo
			"
			<div class=\"row\"><p class=\"lead text-center\"><strong>Math Requirement; have you met <u>one</u> of the following?</strong></p></div>
			<p class=\"col-sm-6\">Accuplacer Score on Arithmetic &#8805; 58<br/>
				Accuplacer Score on Elementary Algebra &#8805; 42<br/>
				College-level math course</p>
			<div class=\"form-group\">
				<div class=\"col-sm-6\">";
			$this->display_radio(array('input_name'=>'math', 'radio_name'=>'math', 'label_name'=>'Yes', 'input_value'=>'1'));
			$this->display_radio(array('input_name'=>'math', 'radio_name'=>'math', 'label_name'=>'No', 'input_value'=>'0', 'checked'=>1));
			$this->display_radio(array('input_name'=>'math', 'radio_name'=>'math', 'label_name'=>'In Progress', 'input_value'=>'2'));
			echo"
				</div>
			</div>
			";
		}

		//Displaying CPR Req
		public function display_cpr_cert_req(){
			echo
			"
				<!-- #### CPR Certification #### -->
				<div class=\"form-group\">
					<p class=\"lead text-center\">CPR Certification (Required)</p>
					<p class=\"col-sm-6\">CPR Certification - Are you currently certified in American Heart Association for the Healthcare Provider OR American Red Cross Professional Rescuer?</p>
					<div class=\"col-sm-6\">";
			$this->display_radio(array('radio_name'=>'cpr_card', 'input_name'=>'cpr_card_yes', 'label_name'=>'Yes', 'input_value'=>'1'));
			$this->display_radio(array('radio_name'=>'cpr_card', 'input_name'=>'cpr_card_no', 'label_name'=>'No', 'input_value'=>'0', 'checked'=>1));
			$this->display_radio(array('radio_name'=>'cpr_card', 'input_name'=>'cpr_card_ip', 'label_name'=>'In Progress', 'input_value'=>'2'));
			echo"
				</div>
				</div>
				<div class=\"form-group\">
					<p class=\"col-sm-6\">Please provide the expiration date listed on card (if applicable)</p>";
			echo "<div class='col-sm-4'>"; $this->display_text(array('input_name'=>'cpr_card_expire', 'readonly'=>1, 'class'=>'datepicker-future', 'placeholder'=>'Click to set date..')); echo "</div>";
			echo"
				</div>
				<div class=\"form-group\">
					<p class=\"col-sm-6\">Please provide the date you will be taking the course (if applicable)</p>";
			echo "<div class='col-sm-4'>"; $this->display_text(array('input_name'=>'cpr_card_course_date', 'readonly'=>1, 'class'=>'datepicker-future', 'placeholder'=> 'Click to set a date..')); echo "</div>";
			echo"
				</div>

				<div class=\"row padded-form\">
					<p ><strong>You will be asked to provide documentation of current CPR certification upon acceptance into the program.</strong></p>
				</div>
				<div class=\"form-group padded-form\">";
			$this->display_checkbox(array('input_name'=>'cpr_option', 'input_value'=>'Will Provide CPR Documentation', 'label_name'=>'I am aware that all ' . $this->program_name . ' students must have current CPR certification on file with the program. Failure to provide this information by the start of the program <u>will</u> result in my dismissal.'));
			echo"
				</div>
				<!-- #### /CPR Certification #### -->
			";
		}

		//Displaying required classes (array parameter)
		public function display_classes_req($classes){

			echo
			"
				<div class='well'><h4 class='text-center'><strong>Course Completion</strong></h4>
				<p>Are you transferring in courses to SCTCC? An official transcript showing the final grade is required for the transfer process. Official transcripts from non-MnSCU schools (ex.,
					U of M; Concordia; Rasmussen etc.) must be delivered in an unopened (sealed) envelope.  Transcripts from a MnSCU school (ex., SCSU, Ridgewater, CLC etc.) can usually be obtained electronically - please submit <u>one</u> request
					at <a href=\"http://www.sctcc.edu/mnscu-transcript-request\">http://www.sctcc.edu/mnscu-transcript-request</a>. <i>If an official transcript is not received at the school by the end of the open application window, the courses
						will not be reviewed during this application process</i>.</p></div>
				<p class='text-center'><em>Have you successfully completed the following courses (with a grade of C or better)?</em></p>
				<hr />
			";

			$last_row = count($classes);
			$current_row = 0;

			foreach($classes as $key => $value) {
				$current_row++;

				//Do we have a mixed array including an AND or OR?
				if(is_array($value)){
					foreach($value as $key => $value){
						if($value == 'AND' || $value == 'OR'){
							echo
								"
							<div class='row padded-light'>
								<p class='lead col-sm-4'>--".$value."--</p>
							</div>
						";
						}else{
							echo
							"
						<p class=\"col-sm-6\"><strong>$key</strong></p>
						<div class=\"form-group\">
							<div class=\"col-sm-6\">";
							$this->display_radio(array('input_name' => $value, 'radio_name' => $value, 'input_value' => '1', 'label_name' => 'Yes'));
							$this->display_radio(array('input_name' => $value, 'radio_name' => $value, 'input_value' => '0', 'label_name' => 'No', 'checked' => 1));
							$this->display_radio(array('input_name' => $value, 'radio_name' => $value, 'input_value' => '2', 'label_name' => 'In Progress'));


							//Some classes aren't the same as the name (IE: blgy2310 is called where/when_human_bio; this swaps that out. (ONLY IN CERTAIN APPS: ADN)
							if($this->program_name == 'ADN'){
								if($value == 'blgy2310' || $value == 'blgy2320'){
									$value = 'human_bio';
								} elseif($value == 'cmst2310' || $value == 'cmst1320'){
									$value = 'comm';
								}
							}

							echo "
							</div>
						</div>
						<p class=\"col-sm-6\">At what college was this course taken?</p>
						<div class=\"form-group\">";
							echo "<div class='col-sm-4'>";
							$this->display_text(array('input_name' => 'where_' . $value));
							echo "</div>";
							echo "
						</div>
						<p class=\"col-sm-6\">Date taken:</p>
						<div class=\"form-group\">";
							echo "<div class='col-sm-4'>";
							$this->display_text(array('input_name' => 'when_' . $value, 'readonly' => 1, 'class' => 'datepicker', 'placeholder' => 'Click to set a date..'));
							echo "</div>";
							echo "
						</div>
						";
						}
					}
					echo "<hr />";
					//If not, print normally
				}else{

					echo
					"
					<p class=\"col-sm-6\"><strong>$key</strong></p>
					<div class=\"form-group\">
						<div class=\"col-sm-6\">";
					$this->display_radio(array('input_name' => $value, 'radio_name' => $value, 'input_value' => '1', 'label_name' => 'Yes'));
					$this->display_radio(array('input_name' => $value, 'radio_name' => $value, 'input_value' => '0', 'label_name' => 'No', 'checked' => 1));
					$this->display_radio(array('input_name' => $value, 'radio_name' => $value, 'input_value' => '2', 'label_name' => 'In Progress'));

					//Some classes aren't the same as the name (IE: blgy2310 is called where/when_human_bio; this swaps that out. (ONLY IN CERTAIN APPS: ADN)
					if($this->program_name == 'ADN'){
						if($value == 'blgy2310' || $value == 'blgy2320'){
							$value = 'human_bio';
						} elseif($value == 'cmst2310' || $value == 'cmst1320'){
							$value = 'comm';
						}
					}

					echo "
						</div>
					</div>
					<p class=\"col-sm-6\">At what college was this course taken?</p>
					<div class=\"form-group\">";
					echo "<div class='col-sm-4'>";
					$this->display_text(array('input_name' => 'where_' . $value));
					echo "</div>";
					echo "
					</div>
					<p class=\"col-sm-6\">Date taken:</p>
					<div class=\"form-group\">";
					echo "<div class='col-sm-4'>";
					$this->display_text(array('input_name' => 'when_' . $value, 'readonly' => 1, 'class' => 'datepicker', 'placeholder' => 'Click to set a date..'));
					echo "</div>";
					echo "
					</div>
					";

					//Leaving an opening on our checkbox, otherwise it gets sandiwched in <hr />'s and it looks wonky.
					if($current_row < $last_row){
						echo "<hr />";
					}
				}
			}

			echo
			"
				<div class=\"form-group\">
					<div class=\"col-sm-12\">";
			$this->display_checkbox(array('input_name' => 'pre_req_option', 'input_value' => 'Yes', 'label_name' => 'I understand that priority will be given to students who have completed all pre-requisite courses prior to application.'));
			echo "
					</div>
				</div>
			";
		}

		//Asking user how many classes they've completed (not necessarily 'required', as seen in biomed app)
		public function display_classes_comp($classes){

			echo"<p class=\"lead text-center\">Have you successfully completed the following courses (with a grade of C or better)?</p>";
			$count = count($classes);
			foreach($classes as $key => $value){
				echo
				"
				<div class=\"form-group\">
        <label for='$value' class=\"col-sm-6\">$key</label for='$value'>";
          echo "<div class='col-sm-6'>";
          $this->display_radio(array('input_name'=>$value, 'radio_name'=>$value, 'input_value'=>'1', 'label_name'=>'Yes'));
          $this->display_radio(array('input_name'=>$value, 'radio_name'=>$value, 'input_value'=>'0', 'label_name'=>'No'));
          echo "</div>";
				echo"
				</div>
				<div class=\"form-group\">
					<p class=\"col-sm-6\">If No, Anticipated Course Completion:</p>";
						echo "<div class='col-sm-4'>"; $this->display_select(array('input_name'=>$value.'_completion', 'default_selected'=>'Select one..'), get_course_comp_names(), get_course_comp_values()); echo "</div>";
				echo"
				</div>
				";
			}
		}

		//Displaying Misc Education info (number of credits as a param for sctcc_credits form input)
		public function display_misc_education($num_credits = null){
			$programs_sctcc_credits = array('Dental Assistant', 'Paramedicine');

			echo "<div class=\"row\"><p class=\"lead text-center\">Education Misc.</p></div>";

			if(in_array($this->program_name, $programs_sctcc_credits)){
				echo"
				<p class=\"col-sm-7\">Have you completed "; if($num_credits) echo $num_credits; else echo "11"; echo " or more pre-requisite credits at SCTCC with a C or above?<br /><em>(Do not include \"In Progress\" credits)</em></p>
				<div class=\"form-group padded-form\">
					<div class=\"col-sm-4\">";
				$this->display_radio(array('input_name'=>'sctcc_credits', 'radio_name'=>'sctcc_credits', 'input_value'=>'1', 'label_name'=>'Yes'));
				$this->display_radio(array('input_name'=>'sctcc_credits', 'radio_name'=>'sctcc_credits', 'input_value'=>'0', 'label_name'=>'No', 'checked'=>1));
				echo"
					</div>
				</div>";
			}
			
			echo
			"
				<p class=\"col-sm-7\">Have you completed any secondary degree/diploma?<br /><em>(This includes military medical education and related MOS)</em></p>
				<div class=\"form-group padded-form\">
					<div class=\"col-sm-4\">";
			$this->display_radio(array('input_name'=>'have_degree', 'radio_name'=>'have_degree', 'input_value'=>'1', 'label_name'=>'Yes'));
			$this->display_radio(array('input_name'=>'have_degree', 'radio_name'=>'have_degree', 'input_value'=>'0', 'label_name'=>'No', 'checked'=>1));
			echo"
					</div>
				</div>

				<p class=\"col-sm-7\">If yes, select the Degree Type:</p>
				<div class=\"form-group\">
					<div class=\"col-sm-5\">";
			$this->display_select(array('input_name'=>'degree_type', 'default_selected'=>'Select one..'), $this->get_degree_names(), $this->get_degree_values());
			echo"
					</div>
				</div>

				<p class=\"col-sm-7\">If Yes: Where was the Degree awarded from:</p>
				<div class=\"form-group\">
					<div class=\"col-sm-5\">";
			$this->display_text(array('input_name'=>'where_degree'));
			echo"
					</div>
				</div>

				<p class=\"col-sm-7\">If Yes: When was the Degree awarded:</p>
				<div class=\"form-group\">
					<div class=\"col-sm-5\">";
			$this->display_text(array('input_name'=>'when_degree'));
			echo"
					</div>
				</div>
				<!-- /Education -->
			";
		}

		//Displaying Agreement info
		public function display_agreement_health(){
			echo
				"
			<ul>
				<li>
					I understand I must be a current SCTCC student with a Pre-".$this->program_name." Major to proceed with this application (this is done through the Admissions Department).
				</li>
				<li>
					I understand and agree that I will be bound by SCTCC's regulations as published in the college catalog and the ".$this->program_name." Student Handbook.
				</li>
				<li>    
					I understand that by completing this application, I am not guaranteed admission into the program and ANY expenses incurred during the admission process are my (the student's) responsibility and are non-refundable.
				</li>
				<li>    
					I understand  that a criminal background study, mantoux test, immunizations history, health physical and proof of insurance are required if accepted into the program and information obtained will be provided to contracted
					clinical facilities as requested. Any fees for these requirements are my (the student's) responsibility.
				</li>
				<li> 
					I understand that the required information (transcripts, NA proof, etc) is due by the application deadline.  Failure to submit information by the deadline will result in the information not being used for this application.
				</li>
				<li> 
					I understand that any transfer courses must have an official transcript on file with SCTCC. It is the student's responsibility to ensure that they have all official transcripts on file with the Records and Registration office at
					SCTCC.
				</li>
				<li>
					I understand that this is a ".$this->program_length."-semester program and must be completed consecutively.
				</li>
		</ul>

		<div class=\"row padded-form\">";
			$this->display_checkbox(array('input_name'=>'agreement', 'input_value'=>'Yes', 'label_name'=>'I certify that all information on this application is correct to the best of my knowledge. I give SCTCC permission to access my academic information
			to ensure eligibility'));
			echo"
		</div>
		
		<p class='text-center'><input class=\"btn btn-primary\" type=\"submit\" value=\"Submit application\" /></p>
		<hr />
		<p><strong>Proof of Health Information</strong></p>
		If accepted into the program, you will be <u>required</u> to provide the following:<p>
		&bull; Proof of Health Insurance<p>
		&bull; Documentation of up-to-date Immunization Health Records<p>
		&bull; Proof of CPR certification<p>
		";
		}

		//Displaying Legal footer
		public function display_footer(){
			echo
				"
				<p><strong>Criminal Background Study:</strong><p/>
			
				Any individual who has direct contact with patients and residents at health care facilities licensed by the Minnesota Department of Health must have a criminal background check completed.  Results of the study are to be on file
				in the ".$this->program_name." Program before students begin their clinical experiences.  Any student who does not pass the criminal background check will not be permitted to participate in clinical experiences.  Therefore,
				the
				individual is ineligible to progress in the ".$this->program_name." Program.<p>
			
				\"If you have been arrested, charged or convicted of any criminal offense, you should investigate the impact that the arrest, charge or conviction may have on your chances of employment in the field you intend to study or on
				your chances to obtain federal, state, and other higher education financial aid.\"<p>
			
				Criminal background studies are performed annually.  Questions and appeals should be direct to the Minnesota Department of Human Services, Licensing Division, 444 Lafayette Blvd., St. Paul, MN  55144-3824.  Phone: (651)
				296-3971
			</p>
			
			<hr>
			<p><strong>DATA PRIVACY:</strong> Federal and state legislation requires that the contents of student files be open to review by the student.  Application form, transcripts, and test data that are sent as part of any application for admission
				will
				be open to the student's review upon request.  Certain elements of data on a student/applicant are considered directory information and may be disclosed without consent.  These include: Name, enrollment status, degrees earned
				and major field of study. A statement of student data privacy rights is available by request from the Registrar's Office.  As a student at a public institution, I understand that my photo may be taken in a group setting, in the
				classroom, or at any activity for college promotional purposes.<p>
			
				<strong>EQUAL OPPORTUNITY:</strong> Admission to the Surgical Technology Program at St. Cloud Technical and Community College is granted without regard to race, creed, color, sex, age, national origin, or disability.  This institution abides by the
				provisions of Title IX federal legislation forbidding discrimination based on sex, Section 504, ADA, and by all other federal and state laws regarding equal opportunity.<p>
			
				<strong>DISABILITY ACCESS:</strong> Call the Disability Access Services Office at (320) 308-5096 (V), 1-800-222-1009.  TTY users dial MN Relay at 711 to contact the college to request accommodations or to receive this document in an alternate
				format.  Requests for reasonable accommodation must be made in advance.  Please allow sufficient time for processing requests

			";
		}

		//Criminal background information
		public function display_criminal_info(){
			echo
			"
			Criminal Background Study:

			Any individual who has direct contact with patients and residents at health care facilities licensed by the Minnesota Department of Health must have a criminal background check completed. Results of the study are to be on file in the Biomedical Equipment Technology Program before students begin their clinical experiences. Any student who does not pass the criminal background check will not be permitted to participate in clinical experiences. Therefore, the individual is ineligible to progress in the Biomedical Equipment Technology Program.
			
			\"If you have been arrested, charged or convicted of any criminal offense, you should investigate the impact that the arrest, charge or conviction may have on your chances of employment in the field you intend to study or on your chances to obtain federal, state, and other higher education financial aid.\"
			
			Criminal background studies are performed annually. Questions and appeals should be direct to the Minnesota Department of Human Services, Licensing Division, 444 Lafayette Blvd., St. Paul, MN 55144-3824. Phone: (651) 296-3971
			";
		}

		//DB Connection
		public function get_DB(){
			if($_SERVER['SERVER_NAME'] == 'localhost'){
				try {
					$dsn = 'mysql:host=localhost;dbname=placement';
					$username = 'root';
					$password = '';
				} catch(PDOException $e) {
					echo "Could not connect; error: " . $e->getMessage();
				}
			}else{
				try {
					$dsn = 'mysql:host=10.1.0.48;dbname=placement';
					$username = 'careerServices';
					$password = 'v56YtGRd';
				} catch(PDOException $e) {
					echo "Could not connect; error: " . $e->getMessage();
				}
			}

			return new PDO($dsn, $username, $password);
		}

		function get_state_names(){
			$state_array = array(
				'Alabama',
				'Alaska',
				'Arizona',
				'Arkansas',
				'California',
				'Colorado',
				'Connecticut',
				'Delaware',
				'Dist of Columbia',
				'Florida',
				'Georgia',
				'Hawaii',
				'Idaho',
				'Illinois',
				'Indiana',
				'Iowa',
				'Kansas',
				'Kentucky',
				'Louisiana',
				'Maine',
				'Maryland',
				'Massachusetts',
				'Michigan',
				'Minnesota',
				'Mississippi',
				'Missouri',
				'Montana',
				'Nebraska',
				'Nevada',
				'New Hampshire',
				'New Jersey',
				'New Mexico',
				'New York',
				'North Carolina',
				'North Dakota',
				'Ohio',
				'Oklahoma',
				'Oregon',
				'Pennsylvania',
				'Rhode Island',
				'South Carolina',
				'South Dakota',
				'Tennessee',
				'Texas',
				'Utah',
				'Vermont',
				'Virginia',
				'Washington',
				'West Virginia',
				'Wisconsin',
				'Wyoming'
			);

			return $state_array;
		}
		function get_state_values(){
			$value_array = array(
				'AL',
				'AK',
				'AZ',
				'AR',
				'CA',
				'CO',
				'CT',
				'DE',
				'DC',
				'FL',
				'GA',
				'HI',
				'ID',
				'IL',
				'IN',
				'IA',
				'KS',
				'KY',
				'LA',
				'ME',
				'MD',
				'MA',
				'MI',
				'MN',
				'MS',
				'MO',
				'MT',
				'NE',
				'NV',
				'NH',
				'NJ',
				'NM',
				'NY',
				'NC',
				'ND',
				'OH',
				'OK',
				'OR',
				'PA',
				'RI',
				'SC',
				'SD',
				'TN',
				'TX',
				'UT',
				'VT',
				'VA',
				'WA',
				'WV',
				'WI',
				'WY'
			);

			return $value_array;
		}

		function get_degree_names(){
			$degree_names = array(
				'AA',
				'AAS',
				'BA',
				'BS',
				'Military or related MOS',
				'Other'
			);

			return $degree_names;
		}
		function get_degree_values(){
			$degree_names = array(
				'AA',
				'AAS',
				'BA',
				'BS',
				'Military',
				'Other'
			);

			return $degree_names;
		}

		function get_course_comp_names(){
			$comp_array = array(
				'Current Semester',
				'Prior to Program',
				'During Program'
			);

			return $comp_array;
		}
		function get_course_comp_values(){
			$comp_array = array(
				'1',
				'2',
				'3'
			);

			return $comp_array;
		}
	}
