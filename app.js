import { Component, OnInit, DoCheck, ViewChild, Input, OnDestroy } from '@angular/core';
import { MenuItem, Paginator, DataTable, FileUpload, MultiSelect, InputTextModule } from 'primeng/primeng';
import { Router } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
// download data
import * as Papa from 'papaparse/papaparse.min.js';
import { saveAs } from 'file-saver';
// service
import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { SettingsService } from 'src/app/shared/service/settings.service';
import { CourseCreationService } from '../../service/course-creation.service';
import { QuestionBankService } from '../../service/question-bank.service';
import { SchoolService } from 'src/app/shared/service/school.service';
import { StaffStudentService } from '../../service/staff-student.service';
import { UsersService } from 'src/app/shared/service/users.service';
import { UploadFileService } from '../../service/upload-file.service';
import { CryptService } from '../../service/crypt.service';
import { SharedserviceService } from '../../shared/service/sharedservice.service';
import { GlobalService } from 'src/app/shared/service/global.service';
import { TestService } from 'src/app/service/test.service';
import { ConfirmationService } from 'primeng/primeng';
import { UtilsComponent } from '../../utils';
import { PaginatorService } from 'src/app/service/paginator.service';
import { DrivesService } from 'src/app/service/drives.service'
@Component({
    selector: 'app-students',
    templateUrl: './student.component.html',
    styleUrls: ['./student.component.css'],
    providers: [DatePipe, ConfirmationService],
})
export class StudentsComponent implements OnInit, DoCheck, OnDestroy {
    @Input() c_name: any;
    @Input() c_id: any;
    batchlisting: any = [];
    targetexamlisting: any = [];
    @ViewChild('paginator') public paginator: Paginator;
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('uploadFile') uploadFile: FileUpload;
    @ViewChild('growl') growl;
    @ViewChild('stdInviteAction') stdAction;
    @ViewChild('qblisttag') multiTags: MultiSelect;
    searchTerm: any;
    breadcrmbItems: MenuItem[];
    homelink: any = {};
    studentListData: any = [];
    filterData: any = [];
    FulldownloadData = [];
    //download data customfields
    selectedCustomFields: any =[];
    customFields: any = [];
    isSelectAllAdditionalCol = false;
    studentcount: any;
    limit;
    visibleSidebar;
    emailSubject;
    emailbody;
    pushmsg;
    pushurl;
    pushtitle;
    bucket;
    email_id;
    emailcheck = true;
    pushcheck = false;
    loadingSend = false;
    branchList: any = [];
    selectedAction;
    // table headers
    isRollno: boolean;
    isRejectReason: boolean;
    isDisableReason: boolean;
    isCourses: boolean;
    isName: boolean;
    isEmail: boolean;
    isPhno: boolean;
    isbadge: boolean;
    isbadge1: boolean;
    isSuperBadge: boolean;
    isDepartment: boolean;
    isDegree: boolean;
    isPlaced: boolean;
    isStatus: boolean;
    isBranch: boolean;
    isTenth: boolean;
    isTwelfth: boolean;
    isDiploma: boolean;
    isUg: boolean;
    isPg: boolean;
    isBacklogs: boolean;
    isBacklogHistory: boolean;
    isApprovedby: boolean;
    isapprovedAt: boolean;
    isrejectedBy: boolean;
    isrejectedAt: boolean;
    isTargetExam: boolean;
    isInterested: boolean;
    isApplicationNo: boolean;
    createdBy;
    batchList;
    batchlist;
    departmentlist;
    targetexamlist;
    degreelist;
    // courselist;
    statuslist;
    tagsList: any = [];
    filterBranch: any = [];
    // Filter variables
    studentBatch;
    studentDepartment;
    studentTargetExam;
    studentTargetexam;
    studentDegree;
    studentCourse;
    studentStatus;
    studentTags;
    studentsMsg = [];
    edit;
    appliedCount = 0;
    selectedStudents;
    checkpath;
    page = 1;
    departmentdata;
    Getbranchid;
    tagdata;
    bulkEnrollData: any = {};
    isDeleteConfirm;
    //removecoordinator
    str: string;
    arr = [];
    count = 0;
    i = 0;
    // pagination
    rowsLimit = 50;
    studentCount: any = 0;
    userdata = JSON.parse(localStorage.getItem('token'));
    institute_type = this.userdata.institute_type;
    school_id;
    branch_id;
    department_id;
    checkedAll;
    purpose: any;
    showRequestTable: any;
    changesList: any;
    selectedSId: any;
    selectMsg;
    openStudent: boolean;
    studentName: any;
    student: any;
    Enrollstatuslist = [];
    disableButton: any;
    studentEnrollstatus;
    emptyMessage: any = 'Loading...';
    selectAllFlag: any;
    startIndex: any;
    loadingBtn = false;
    username;
    user_id;
    user_role;
    sender_img;
    isActiveRdeactiveConfirm = false;
    bulkbranch_id;
    bulkcourseids;
    branchlist;
    bulkemailids;
    bulkenrollstatus: boolean;
    emailInvalid;
    emailArray;
    OpenenrollDialogBox;
    emailPattern;
    Branch: any;
    @Input() branchId: any;
    @Input() departmentId: any;
    activateHeader: string;
    userPermission: any;
    mainDepartmentUser: any;
    schoolData;
    // reject student
    rejectText: any;
    rejectResonStudentDisplay: boolean =true; 
    isReject: any;
    disableText: any;
    disableResonStudentDisplay: boolean =true; 
    disableResonStudentDisplayemail: boolean =true;
    isDisable: any;
    // edit in ACTiON:
    editModalDisplay = false;
    tagslist;
    bulk_user_ids;
    studenttaglist;
    bullk_degree_id: any;
    badgedialog = false;
    consumedlist = [];
    earnedlist = [];
    badgeradio = 'consumed';
    blocked = false;
    penalizedList = [];
    addBadge: any;
    addSuperbadge: any;
    currentBadge: any;
    currentSuperbadge: any;
    currentStudentValue: any;
    selectbadgetype = 'earned';
    addBulkBadgesDialog = false;
    enableBadgeSchool: any;
    enableSuperBadgeSchool: any;
    // bulkUpdate
    bulkUpdateDialouge = false;
    fieldDetails: any = [];
    addFieldDetails: any = [];
    fileInvalidFormat = false;
    csvHeader: any = [];
    keySelected: any = [];
    updateStudentDialog = false;
    showCSVDataTable = false;
    alive: any;
    csvData = [];
    csvFile;
    tenthColumn = false;
    twelfthColumn = false;
    diplomaColumn = false;
    ugColumn = false;
    pgColumn = false;
    curColumn = false;
    backColumn = false;
    intColumn = false;
    csvFail;
    csvArray: any = [];
    attributesarray: any = [];
    addFieldData: any = [];
    downloadCsv: any = [];
    basic_mandatory_fields: any = [];
    enableBulkUpdate = true;
    filename;
    Filename;
    Filesize;
    call1;
    call2;
    call8;
    call9;
    call10;
    call11;
    call12;
    call13;
    call14;
    call15;
    call16;
    call17;
    sortOrder = true;
    sortby;
    sortvalue: any;
    totalDegree: any = [];
    totalDepartment: any = [];
    default_filter: any = {};
    firstBranch: any;
    pushImage = [];
    urlError = false;
    downloadSchoolFields: any = [];
    stdUpdateBatch: any;
    stdUpdateBatchList: any = [];
    @Input() batchIds: any = [];
    bulkbatch_id: any;
    keysToCheck = [];
    showDownload = false;
    isStudentName = false;
    isStudentNameSplit = false;
    isStudentEmail = false;
    isStudentRno = false;
    isStudentRejectReason = false;
    isStudentDisableReason = false;
    isStudentCourses = false;
    isPortalAccessStatus = false;
    isVerifiedPicture = false;
    isVerifiedResumedownload = false;
    isApplicationNumber = false;
    isStudentPno = false;
    isStudentdob = false;
    isStudentGender = false;
    isBadge: boolean = false;
    isSuperbadge: boolean = false;
    isInterestedPlacement: boolean = false;
    isStudentBranch = false;
    isStudentBatch = false;
    isStudentDepartment = false;
    isStudentDegree = false;
    isStudentStatus = false;
    isStudentTenth = false;
    isStudentTwelth = false;
    isStudentDiploma = false;
    isStudentUg = false;
    isStudentPg = false;
    isStudentCB = false;
    isStudentBH = false;
    isStudentCustom = false;
    isStudentAppBy = false;
    actualCustomFields: any = [];
    isSelectAll = false;
    batchListing: any = [];
    isSaveTableDefaults: boolean = false;
    show_loader: any = false;
    targetExamListing: any = [];
    alreadySelectedBatch: any = [];
    alreadySelectedTarget: any = [];
    isShowInactive: any = false;
    editing: any = [];
    isPortalC: any = false;
    isVerifiedPic: any = false;
    isVerifiedResume: any = false;
    isDriveInactive: any = false;
    isPlacementInterested: any = false;
    isPlacedCount: any = false;
    public bulkVerifiedPic = {
        dialog: false,
        closable: true,
        header: '',
        content: '',
        uploadLabel: 'Upload',
        loading: false,
        progress: 0,
    };
    editEmail: any = false;
    editEmailId: any = false;
    editStudent: any = false;
    tempemail: any;
    messageType: any;
    customEmails: any;
    customEmailList: any = [];
    customEmailInvalid: any = false;
    customValid: any = false;
    customLoader: any = false;
    pathPay: any;
    basicDetails: any = [];
    firstNameColumn: boolean = false;
    genderColumn: boolean = false;
    dobColumn: boolean = false;
    lastNameColumn: boolean = false;
    phoneColumn: boolean = false;
    rollNoColumn: boolean = false;
    userAttributesArray: any = [];
    phonePattern: any;
    bulkResetPasswordDialog: boolean;
    resetUploadDownload: string;
    bulkResetPasswordCsv: any;
    instructionsForCreate: any = 'Enter valid email \nDont use comma in password field';
    loadgenerate: any;
    schoolsMeta: any;
    openPlacedDriveDialog: any = false;
    companyName: any = [];
    downloadCSVAction = false;
    downloadFileType: any = 'csv';
    stdUpdateDepartment: any = '';
    constructor(
        private Location: Location,
        public UploadFileService: UploadFileService,
        public Sharedserviceservice: SharedserviceService,
        private crypt: CryptService,
        private testService: TestService,
        private SettingsService: SettingsService,
        private courseCreationService: CourseCreationService,
        public router: Router,
        private UsersService: UsersService,
        public QuestionBankService: QuestionBankService,
        public schoolService: SchoolService,
        public StaffStudentService: StaffStudentService,
        private datePipe: DatePipe,
        private sanitizer: DomSanitizer,
        public globalservice: GlobalService,
        private confirmationService: ConfirmationService,
        public drivesService: DrivesService
    ) {
        if (this.userdata && this.userdata.school_branch_department_users) {
            this.school_id = this.userdata.school_branch_department_users[0].school_id;
            this.username = this.userdata.name;
            this.user_id = this.userdata.user_id;
            this.email_id = this.userdata.email;
            this.user_role = this.userdata.school_branch_department_users[0].user_role;
            this.branch_id = this.userdata.school_branch_department_users[0].branch_id;
            this.department_id = this.userdata.school_branch_department_users[0].department_id;
        }
        this.editEmail =
            this.userdata.enable_features && this.userdata.enable_features.allow_edit_email
                ? this.userdata.enable_features.allow_edit_email
                : false;
        if (this.username) {
            if (_.includes(this.username, '$')) {
                this.username = this.username.replace('$', ' ');
            }
        }
        if (this.userdata && this.userdata.profile_pic) {
            this.sender_img = this.userdata.profile_pic;
        }
        if (!JSON.parse(localStorage.getItem('token')).name) {
            this.router.navigate(['/settings/users']);
        }
    }
    ngOnInit() {
        this.SettingsService.toggleBlockUI(false);
        this.schoolData = JSON.parse(localStorage.getItem('school_details'));
        if (localStorage.getItem('default_filter')) {
            this.default_filter = JSON.parse(localStorage.getItem('default_filter'));
        }
        this.checkpath = window.location.pathname;
        this.selectTableHeaders();
        this.studentcount = 0;
        this.startIndex = 0;
        this.selectedAction = null;
        this.purpose = this.userdata.purpose;
        this.getAllTags();
        this.rowsLimit = 50;
        this.breadcrmbItems = [];
        this.breadcrmbItems.push({
            label: this.purpose === 'Recruitment' ? 'Candidates' : 'Students',
        });
        this.homelink.routerLink = '/dashboard';
        this.checkpath = window.location.pathname;
        this.getStudentData();
        const payload1 = {
            school_id: this.school_id,
        };
        this.edit = [];
        if (this.checkpath === '/student') {
            if (this.purpose === 'Exams App' || this.userdata.purpose === 'Recruitment') {
                this.edit = [];
                this.edit.push({ label: 'Action', value: null });
                if (this.userdata.user_permission.student_edit) {
                    this.edit.push({ label: 'Delete', value: 'delete' });
                }
                this.edit.push({ label: 'Send Message', value: 'msg' });                
                this.edit.push({ label: 'Download Resume', value: 'resume' });
                this.edit.push({ label: 'Download Custom Field Uploaded File', value: 'cf_file_upload' });
            } else {
                this.edit = [];
                this.edit.push({ label: 'Action', value: null });
                if (this.userdata.user_permission.student_edit) {
                    this.edit.push({ label: 'Delete', value: 'delete' });
                }
                if( this.userdata.user_permission.student_aprove_create) {
                    this.edit.push({ label: 'Approve', value: 'approve' });
                } 
                if(this.userdata.user_permission.student_reject_create) {
                    this.edit.push({ label: 'Reject', value: 'reject' });
                }
                this.edit.push({ label: 'Send Message', value: 'msg' });
                this.edit.push({ label: 'Download Resume', value: 'resume' });
                this.edit.push({ label: 'Make Coordinator', value: 'mc' });
                this.edit.push({ label: 'Remove Coordinator', value: 'rc' });
                this.edit.push({ label: 'Download Custom Field Uploaded File', value: 'cf_file_upload' });
                this.edit.push({ label: 'Disabled from '+this.drivesService.drivesNameFormatView.drivesNamelist.label, value: 'drive_disabled' });
                this.edit.push({ label: 'Enable '+this.drivesService.drivesNameFormatView.drivesNamelist.label, value: 'drive_enabled' });
                
            }
            if (this.userdata.user_permission.student_edit) {
                this.edit.push({ label: 'Reset Password', value: 'password' });
                this.edit.push({ label: 'Resend Link', value: 'link' });
                this.edit.push({ label: 'Edit', value: 'edit' });
                this.edit.push({ label: 'Disable', value: 'inactive' });
            }
        }
        if (this.checkpath === '/course') {
            this.edit.push({ label: 'Action', value: null });
            this.edit.push({ label: 'Enroll', value: 'enroll' });
            this.edit.push({ label: 'Send Message', value: 'msg' });
        }
        if (this.checkpath === '/contests') {
            this.edit.push({ label: 'Action', value: null });
            this.edit.push({ label: 'Invite', value: 'enroll' });
            this.edit.push({ label: 'Send Message', value: 'msg' });
        }
        this.statuslist = [];
        this.commonlisting();
        this.limit = [];
        this.limit.push({ label: 50, value: 50 });
        this.limit.push({ label: 100, value: 100 });
        this.limit.push({ label: 150, value: 150 });
        this.batchlist = [];
        this.Enrollstatuslist = [];
        if (this.checkpath === '/course') {
            this.Enrollstatuslist.push({ label: 'All', value: null });
            this.Enrollstatuslist.push({ label: 'Enrolled', value: true });
            this.Enrollstatuslist.push({ label: 'Not Enrolled', value: false });
        }
        if (this.checkpath === '/contests') {
            this.Enrollstatuslist.push({ label: 'All', value: null });
            this.Enrollstatuslist.push({ label: 'Invited', value: true });
            this.Enrollstatuslist.push({ label: 'Not Invited', value: false });
        }
        this.departmentlist = [];
        this.departmentlist.push({ label: 'All', value: null });
        this.degreelist = [];
        this.degreelist.push({ label: 'All', value: null });
        this.selectedStudents = [];
        this.openStudent = false;
        this.disableButton = false;
        this.emailPattern = this.SettingsService.emailPattern;
        this.userPermission = this.userdata.user_permission;
        this.mainDepartmentUser = this.userdata.mainDepartmentUser;
        this.Branch = this.globalservice.getBranchName();
        this.call1 = this.schoolService.getPlatformSettings(payload1).subscribe((response) => {
            const values: any = response;
            this.schoolsMeta = JSON.parse(values.data);
            this.enableBadgeSchool = values && values.data ? JSON.parse(values.data).badgeswitch : false;
            this.enableSuperBadgeSchool = values && values.data ? JSON.parse(values.data).superbadgeswitch : false;
            if ((this.enableBadgeSchool || this.enableSuperBadgeSchool) && this.checkpath === '/student') {
                if(this.userdata.user_permission.student_edit) {
                this.edit.push({ label: 'Add Badges/Superbadges', value: 'ab' });
            }
            }
            this.editing = this.editing.concat(this.edit);
            if (this.isShowInactive) {
                this.edit = [];
                this.edit.push({ label: 'Action', value: null });
                this.edit.push({ label: 'Enable', value: 'active' });
            }
            if (this.isDriveInactive) {
                this.edit = [];
                this.edit.push({ label: 'Action', value: null });
                this.edit.push({ label: 'Enable', value: 'active' });
            }
        });
    }
    searchApplied() {
        this.page = 1;
        this.paginator.changePage(0);
    }
  listingstudent(p) {
        this.uncheckAll();
        this.getUsers();
        this.checkedAll = false;
        this.emptyMessage = 'Loading...';
        this.studentCount = this.studentcount;
        this.filterData = [];
        this.studentListData = [];
      
        if (this.studentcount !== 0 && this.studentcount / this.rowsLimit < 1) {
            this.page = Math.ceil(this.studentcount / this.rowsLimit);
        }
        // this.paginator.first = (this.page - 1) * this.rowsLimit;
        this.alreadySelectedBatch = this.studentBatch;
        this.alreadySelectedTarget = this.studentTargetexam;
        const payload: any = {
            page: p ? p : this.page,
            page_limit: this.rowsLimit,
            department: this.studentDepartment,
            targetexam_id: this.studentTargetexam,
            enrolled_status: this.studentEnrollstatus,
            tags: this.studentTags,
            batch: this.studentBatch,
            degree: this.studentDegree,
            search: this.searchTerm,
            school_id: this.school_id,
            user_role: 'student',
            isPortalAccess: this.isShowInactive,
            userstatus: this.studentStatus,
            isDrivePortalAccess: this.isDriveInactive,
            isPlacementInterested: this.isPlacementInterested,
            purpose: this.purpose,
            all_branches: _.compact(_.map(this.branchList, 'value')),
            ifinmainDepartment: _.find(this.departmentlist, (each: any) => {
                return each.label.includes('admin');
            })
                ? true
                : false,
        };
        if (this.checkpath === '/course') {
            if (this.filterBranch && this.filterBranch.length) {
                payload.branch_id = this.filterBranch;
            } else {
                payload.all_branches = this.branchId;
                payload.all_batches = this.batchIds && this.batchIds.length ? this.batchIds : [];
                this.selectMsg = [];
                this.selectMsg.push({
                    severity: 'warn',
                    summary: 'Warning!',
                    detail: 'Please select one ' + this.Branch,
                });
                this.emptyMessage = 'No records found';
                return;
            }
        } else {
            payload.branch_id = this.filterBranch;
        }
        if (this.sortby) {
            payload.sort_by = this.sortby;
            if (this.sortOrder) {
                payload.sort_order = 'ASC';
            } else {
                payload.sort_order = 'DESC';
            }
        }               
        this.call2 = this.SettingsService.getStudentlist(payload).subscribe((response: any) => {
            const SL = response;
            this.emptyMessage = 'No records found';
            if (response.message === 'You dont have permission') {
                this.showGrowl('error', 'Permission Denied', 'You dont have permission');
            } else {            
            if (this.studentEnrollstatus === false && this.studentEnrollstatus !== null) {
                SL.data.data = _.filter(SL.data.data, (enstatus) => {
                    return !enstatus.course_students;
                });
            }
            if (this.studentEnrollstatus === false && this.studentEnrollstatus !== null) {
                this.studentcount = SL.data.data.length;
            } else {
                this.studentcount = SL.data.count;
            }                
            this.UsersService.studentCount.next(this.studentcount);
             this.filterData = [];
             this.studentListData = [];
            _.forEach(SL.data.data, (o: any) => {
                if (o.email_verified) {
                     status = 'Joined';
                } else {
                    status = 'Invited';
                }
                let degree;
                let targetexam;
                let degree_id;
                let target_id;
                switch (this.institute_type) {
                    case 'college':
                        if (o.school_branch_department_users.school_degrees) {
                            degree = o.school_branch_department_users.school_degrees.degree;
                            degree_id = o.school_branch_department_users.school_degrees.degree_id;
                        } else {
                            degree = '-';
                        }
                        break;
                    case 'training_institute':
                        this.isBranch = false;
                        this.isbadge1 = false;
                        this.isSuperBadge = false;
                        this.isInterestedPlacement = false;
                        if (o.school_branch_department_users.school_targetexam) {
                            targetexam = o.school_branch_department_users.school_targetexam.targetexam_name;
                            target_id = o.school_branch_department_users.school_targetexam.targetexam_id;
                        } else {
                            targetexam = '-';
                        }
                        break;
                }                
                const eachStudent: any = {
                   roll_no: o.roll_no ? o.roll_no : '-',
                    email_verified: o.email_verified,
                    gender: o.gender,
                    name: o.name ? o.name.split('$')[0] + ' ' + o.name.split('$')[1] : '- ',
                    driveCount: o.driveCount ? o.driveCount:'-',
                    placedDriveDetails: o.placedDriveDetails && o.placedDriveDetails.length ? o.placedDriveDetails : [],
                    email: o.email ? o.email : '-',
                    phoneno: o.phone ? o.phone : '-',
                    dob: o.dob ? o.dob.substring(0, 10) : '-',
                    profile_pic: o.profile_pic,
                    verified_pic: o.verified_pic ? o.verified_pic : undefined,
                    isDeletable: o.isDeletable,
                    badge: o.badge,
                    superbadge: o.superbadge,
                    branch: [],
                    branch_id: [],
                    batch: [],
                    batch_id: [],
                    degree: [],
                    degree_id: [],
                    target_id: [],
                    targetexam: [],
                    department: [],
                    department_id: [],
                    role: o.school_branch_department_users.user_role ? o.school_branch_department_users.user_role : '-',
                    status: status ? status : '-',
                    id: o.user_id ? o.user_id : '-',
                };              
                if (this.schoolData.school_code === 'sambhram' || this.schoolData.school_code === 'nstech196') {
                    if (o.application_no && o.application_no < 10) {
                        o.application_no = 'SUB/IFB-001/000'+ o.application_no;
                    } else if (o.application_no && o.application_no < 100) {
                        o.application_no = 'SUB/IFB-001/00'+ o.application_no;
                    } else if (o.application_no && o.application_no < 1000) {
                        o.application_no = 'SUB/IFB-001/0'+ o.application_no;
                    } else if (o.application_no) {
                        o.application_no = 'SUB/IFB-001/'+ o.application_no;
                    }
                    eachStudent.application_no = o.application_no ? o.application_no : '-'    
                } else {
                    eachStudent.application_no = '-';
                }
                if (o.school_branch_department_users && o.school_branch_department_users.length) {
                    eachStudent.branch_id = _.map(o.school_branch_department_users, 'branch_id');
                    eachStudent.department_id = _.map(o.school_branch_department_users, 'department_id');
                    eachStudent.batch_id = _.map(o.school_branch_department_users, 'batch');
                    eachStudent.degree_id = _.map(o.school_branch_department_users, 'degree_id');
                    eachStudent.target_id = _.map(o.school_branch_department_users, 'targetexam_id');
                    eachStudent.branch = _.map(o.school_branch_department_users, 'school_branches.branch_name');
                    eachStudent.branch = _.join(eachStudent.branch, ', ');
                    eachStudent.department = _.map(
                        o.school_branch_department_users,
                        'school_branch_department.department_name',
                    );
                    eachStudent.department = _.join(eachStudent.department, ', ');
                    if (o.school_branch_department_users[0].school_batches) {
                        eachStudent.batch = _.map(o.school_branch_department_users, 'school_batches.batch');
                        eachStudent.batch = _.join(eachStudent.batch, ', ');
                    } else {
                        eachStudent.batch = '';
                    }
                    if (o.school_branch_department_users[0].school_targetexam) {
                        eachStudent.targetexam = _.map(
                            o.school_branch_department_users,
                            'school_targetexam.targetexam_name',
                        );
                        eachStudent.targetexam = _.join(eachStudent.targetexam, ', ');
                    } else {
                        eachStudent.targetexam = '';
                    }
                    if (o.users_has_tags && o.users_has_tags.length > 0) {
                        eachStudent.tag_detail = o.users_has_tags;
                    }
                    if (o.student_custom_fields && o.student_custom_fields.length > 0) {
                        eachStudent.student_custom_fields = o.student_custom_fields;
                    }
                    if (this.isShowInactive || this.isDriveInactive) {
                        eachStudent.portal_status =
                            o.portal_access_status && o.portal_access_status.status ? this.drivesService.drivesNameFormatView.drivesNamelist.label+' Disable' : 'Disable';
                    }
                    eachStudent.disable_Reason =
                        o.portal_access_status && o.portal_access_status.disable_Reason ?
                            o.portal_access_status.disable_Reason : '';
                            eachStudent.courseCount = o.courseCount;
                            if (o.courseCount>0) {
                                eachStudent.Courses = _.join(o.coursenames, ', ');
                            } else {
                                eachStudent.Courses = '-';
                            }
                            
                }
                if(o && o.student_custom_fields && o.student_custom_fields.length)
                {
                    _.forEach(o.student_custom_fields[0].fields, (obj: any) =>{
                        if(obj && obj.type === 'resume' && obj.answer){
                            eachStudent.verified_resume = 'Yes';
                        }
                    });
                    if(!eachStudent.verified_resume){
                        eachStudent.verified_resume = 'No';
                    }
                }
                else{
                    eachStudent.verified_resume = 'No';
                }
                this.studentListData.push(eachStudent);
                this.filterData.push(eachStudent);
            }); 
        }  
        });         
    }
    listingdegree() {
        this.degreelist = [];
        if (this.filterBranch) {
            for (let i = 0; i < this.totalDegree.length; i++) {
                if (this.filterBranch.includes(this.totalDegree[i].branch_id)) {
                     this.degreelist.push(this.totalDegree[i]);
                }
            }
        }
    }
    commonlisting() {
        this.SettingsService.checkUserPermission().then((resp: any) => {
            if (this.checkpath === '/course' || this.checkpath === '/contests') {
                const temp = [];
                if (typeof this.branchId === 'string') {
                    this.branchId = [this.branchId];
                }
                _.forEach(this.branchId, (b) => {
                    temp.push({
                        label: 'temp',
                        value: b,
                    });
                });
                this.branchList = _.concat(this.branchList, _.intersectionBy(resp.branches, temp, 'value'));
                _.forEach(this.branchList, (b) => {
                    if (!b.label) {
                        b.value = b.value;
                        b.label = b.branch_name;
                    }
                });
                this.branchlist = [];
                this.branchlist = this.branchlist.concat(this.branchList);
            } else {
                for (const o of resp.branches) {
                    this.branchList.push({ label: o.label, value: o.value });
                }
                this.firstBranch = this.branchList[0].value;
            }
            const deffaultBranch = _.sortBy(this.branchList, 'CreatedAt')[0];
            this.filterBranch = [];
            this.filterBranch.push(deffaultBranch.value);
            if (resp && resp.degrees) {
                for (const o of resp.degrees) {
                    const degBranch: any = this.branchList.find((each: any) => {
                        return each.value === o.branch_id;
                    }); 
                    if (degBranch) {
                        this.totalDegree.push({
                            label: degBranch.label + ' - ' + o.label,
                            value: o.value,
                            branch_id: o.branch_id,
                        });
                    }
                }
            }
            if (resp && resp.departments) {
                for (const o of resp.departments) {
                    const depBranch: any = this.branchList.find((each: any) => {
                        return each.value === o.branch_id;
                    });
                    if (depBranch) {
                        this.totalDepartment.push({
                            label: depBranch.label + ' - ' + o.label,
                            value: o.value,
                            branch_id: o.branch_id,
                        });
                    }
                }
            }
            this.branchList = _.sortBy(this.branchList, 'label');
            if (this.checkpath === '/contests') {
                this.institute_type === 'training_institute'
                    ? this.getBatchList(resp.targetexams)
                    : this.getBatchList(resp.batches);
            } else {
                this.getBatchOrTargetExamListing(resp.batches, resp.targetexams);
            }
            if (this.purpose === 'Exams App') {
                this.statuslist.push({ label: 'All', value: null });
                this.statuslist.push({ label: 'Invited', value: '0' });
                this.statuslist.push({ label: 'Joined', value: '1' });
            } else {
                this.statuslist.push({ label: 'All', value: null });
                this.statuslist.push({ label: 'Invited', value: '0' });
                this.statuslist.push({ label: 'Joined', value: '1' });
                this.statuslist.push({ label: 'Published', value: '2' });
                this.statuslist.push({ label: 'Approved', value: '3' });
                this.statuslist.push({ label: 'Rejected', value: '4' });
                this.statuslist.push({ label: 'Requesting Changes', value: '5' });
                this.statuslist.push({ label: this.drivesService.drivesNameFormatView.drivesNamelist.singler+' Disabled', value: '6' });
                this.changesList = [];
            }
        });
    }
    getBatchOrTargetExamListing(batches, targetExams) {
        if (this.institute_type === 'college' || this.institute_type === 'company') {
            this.batchlisting = [];
            _.forEach(batches, (each: any) => {
                if (this.batchIds && this.batchIds.length && this.checkpath === '/course') {
                    if (this.batchIds.includes(each.value)) {
                        this.batchlisting.push({
                            label: each.label,
                            value: each.value,
                            branch_id: each.branch_id,
                        });
                    }
                } else {
                    this.batchlisting.push({
                        label: each.label,
                        value: each.value,
                        branch_id: each.branch_id,
                    });
                }
            });
            _.forEach(this.batchlisting, (each: any) => {
                const foundSameBranch = _.find(this.branchList, (one: any) => {
                    return one.value === each.branch_id;
                });
                if (foundSameBranch) {
                    each.label = foundSameBranch.label + ' - ' + each.label;
                }
            });
            this.batchlisting = _.filter(this.batchlisting, (one: any) => {
                return _.includes(_.map(this.branchList, 'value'), one.branch_id);
            });
            this.batchlisting = _.sortBy(this.batchlisting, 'label');
            if (this.filterBranch && this.filterBranch.length === 1) {
                this.stdUpdateBatchList = this.batchlisting
                    .map((one: any) => {
                        if (this.filterBranch[0] === one.branch_id) {
                            return one;
                        }
                    })
                    .filter((every: any) => {
                        return every;
                    });
            } else {
                this.stdUpdateBatchList = [];
            }
        } else if (this.institute_type === 'training_institute') {
            this.targetexamlisting = [];
            _.forEach(targetExams, (each: any) => {
                this.targetexamlisting.push({
                    label: each.label,
                    value: each.value,
                    branch_id: each.branch_id,
                });
            });
            _.forEach(this.targetexamlisting, (each: any) => {
                const foundSameBranch = _.find(this.branchList, (one: any) => {
                    return one.value === each.branch_id;
                });
                if (foundSameBranch) {
                    each.label = foundSameBranch.label + ' - ' + each.label;
                }
            });
            this.targetexamlisting = _.filter(this.targetexamlisting, (one: any) => {
                return _.includes(_.map(this.branchList, 'value'), one.branch_id);
            });
            this.targetexamlisting = _.sortBy(this.targetexamlisting, 'label');
        }
        if (this.checkpath === '/student' && !this.c_id) {
            this.selectDefaults();
        } else {
            const deffaultBranch = _.sortBy(this.branchList, 'createdAt')[0];
            this.selectBranch(deffaultBranch);
        }
    }
    getBatchList(batches) {
        this.batchlisting = [];
        if (this.institute_type === 'training_institute') {
            this.targetexamlisting = [];
            _.forEach(batches, (each: any) => {
                const branch: any = this.branchList.find((each1: any) => {
                    return each1.value === each.branch_id;
                });
                if (branch) {
                    this.targetexamlisting.push({
                        label: branch.label + '-' + each.label,
                        value: each.value,
                        branch_id: each.branch_id,
                    });
                }
            });
            this.targetexamlisting = _.filter(this.targetexamlisting, (one: any) => {
                return _.includes(_.map(this.branchList, 'value'), one.branch_id);
            });
            this.targetexamlisting = _.sortBy(this.targetexamlisting, 'label');
            this.targetExamListing = this.targetexamlisting;
            this.selectBranch(this.targetExamListing);
        } else {
            batches.forEach((val) => {
                if (this.batchIds && this.batchIds.length) {
                    if (this.batchIds.includes(val.value)) {
                        this.batchlisting.push({
                            label: val.label,
                            value: val.value,
                            branch_id: val.branch_id,
                        });
                    }
                } else {
                    this.batchlisting.push({
                        label: val.label,
                        value: val.value,
                        branch_id: val.branch_id,
                    });
                }
            });
            _.forEach(this.batchlisting, (each: any) => {
                const foundSameBranch = _.find(this.branchList, (one: any) => {
                    return one.value === each.branch_id;
                });
                if (foundSameBranch) {
                    each.label = foundSameBranch.label + ' - ' + each.label;
                }
            });
            this.batchlisting = this.batchlisting.filter((each) => {
                return _.includes(_.map(this.branchList, 'value'), each.branch_id);
            });
            this.batchListing = this.batchlisting;
            const deffaultBranch = _.sortBy(this.branchList, 'createdAt')[0];
            this.selectBranch(deffaultBranch);
        }
    }
    listingdepartment() {
        this.departmentlist = [];
        if (this.filterBranch) {
            for (let i = 0; i < this.totalDepartment.length; i++) {
                if (this.filterBranch.includes(this.totalDepartment[i].branch_id)) {
                    this.departmentlist.push(this.totalDepartment[i]);
                }
            }
        }
        // (this.purpose === 'Exams App') ? this.listingstudent(undefined) : this.ppaStudentList(undefined);
    }
    listingstatus() {
        if (this.studentStatus) {
            const userstatus = this.studentStatus;
            this.call8 = this.SettingsService.listStatus(userstatus, this.school_id).subscribe((response) => {});
        }
    }
    studentdelete() {
        const deleteUser: any = this.userdata.purpose === 'Recruitment' ? 'candidates' : 'students ';
        if (this.filterBranch && this.filterBranch.length && this.filterBranch.length === 1) {
            if (this.selectedStudents && this.selectedStudents.length) {
                const data = [];
                if (this.selectAllFlag) {
                    this.deleteAll();
                } else {
                    _.forEach(this.selectedStudents, (stud: any) => {
                        data.push({
                            id: stud.id,
                            department_id: stud.department_id,
                            s_profile_id:
                                stud && stud.markData && stud.markData.s_profile_id ? stud.markData.s_profile_id : null,
                        });
                    });
                    const payload: any = {
                        delete: data,
                        user_role: 'student',
                        branch_id: this.filterBranch[0],
                        purpose: this.userdata.purpose,
                    };
                    this.globalservice.setDoneState(true);
                    this.call9 = this.SettingsService.deletestaff(payload).subscribe(
                        (response: any) => {
                            this.globalservice.setDoneState(false);
                            if (response && response.data && response.data.severity) {
                                const resp: any = response.data;
                                this.purpose === 'Exams App'
                                    ? this.listingstudent(undefined)
                                    : this.ppaStudentList(undefined);
                                this.studentsMsg = [];
                                this.studentsMsg.push({
                                    severity: resp.severity,
                                    summary: resp.summary,
                                    detail: resp.detail,
                                });
                            } else {
                                this.studentsMsg = [];
                                this.studentsMsg.push({
                                    severity: 'error',
                                    summary: 'Deletion Failed',
                                    detail: 'Selected ' + deleteUser + ' could not be deleted',
                                });
                            }
                            setTimeout(() => {
                                this.studentsMsg = [];
                            }, 3000);
                            this.selectedAction = null;
                            this.selectedStudents = [];
                            this.uncheckAll();
                            this.closeDeleteConfirmation();
                        },
                        (error) => {
                            this.studentsMsg = [];
                            this.studentsMsg.push({
                                severity: 'error',
                                summary: 'Something went wrong',
                                detail: 'Unable to delete  ' + deleteUser,
                            });
                            this.selectedAction = null;
                            this.selectedStudents = [];
                            this.uncheckAll();
                            this.closeDeleteConfirmation();
                        },
                    );
                }
            } else {
                this.studentsMsg = [];
                this.studentsMsg.push({
                    severity: 'error',
                    summary: 'Failed',
                    detail: 'Please Select The Students',
                });
                this.closeDeleteConfirmation();
            }
        } else {
            this.studentsMsg = [];
            this.studentsMsg.push({
                severity: 'warn',
                summary: 'Alert',
                detail: 'Please Select One ' + this.Branch + ' To Delete Students',
            });
            this.closeDeleteConfirmation();
        }
    }
    setPageLimit(event) {
        this.rowsLimit = event.value;
        this.paginator.changePage(0);
        this.uncheckAll();
        this.selectedStudents = [];
    }
    getStudentData() {
        this.studentCount = this.studentListData.length;
    }
    invitePagenav() {
        this.router.navigate(['/student/invite']);
    }
    openFilter(filter, event) {
        if (this.filterBranch && this.filterBranch.length) {
            filter.toggle(event);
        } else {
            this.selectMsg = [];
            this.selectMsg.push({
                severity: 'warn',
                summary: 'Alert',
                detail: 'Filter will be enabled only when any ' + this.Branch + ' is selected',
            });
        }
    }
    openSettings(settings, event) {
        window.scrollTo(0, 50);
        settings.toggle(event);
    }
    resetFilter(filter, status) {
        this.studentDepartment = null;
        this.studentEnrollstatus = null;
        this.studentDegree = null;
        this.studentStatus = null;
        this.studentTags = null;
        this.isPortalC = false;
        this.isVerifiedPic = false;
        this.isVerifiedResume = false;
        this.isShowInactive = false;
        this.isDriveInactive = false;
        this.isPlacementInterested = false;
        this.edit = [];
        this.edit = this.edit.concat(this.editing);
        // this.studentCourse = null;
        this.appliedCount = 0;
        filter.visible = false;
        if (status) {
            this.purpose === 'Exams App' ? this.listingstudent(undefined) : this.ppaStudentList(undefined);
        }
        this.closeTags();
    }
    applyTableFilterFun(filter) {
        this.page = 1;
        this.applyTableFilter(filter);
        this.closeTags();
    }
    closeTags() {
        if (this.multiTags) {
            this.multiTags.hide();
        }
    }
    applyTableFilter(filter) {
        this.appliedCount = 0;
        filter.visible = false;
        if (this.isShowInactive) {
            this.isPortalC = true;
            this.edit = [];
            this.edit.push({ label: 'Action', value: null });
            this.edit.push({ label: 'Enable', value: 'active' });
        } else if (this.isDriveInactive) {
            this.isPortalC = true;
            this.edit = [];
            this.edit.push({ label: 'Action', value: null });
            this.edit.push({ label: 'Enable', value: 'active' });
        } else {
            this.isPortalC = false;
            this.edit = [];
            this.edit = this.edit.concat(this.editing);
        }
        // if (this.studentBatch && this.studentBatch !== 'All') {
        //   this.appliedCount++;
        // }
        this.checkFilterCount();
        this.purpose === 'Exams App' ? this.listingstudent(undefined) : this.ppaStudentList(undefined);
    }
    selectallBranch() {
        if (this.filterBranch && this.filterBranch.length > 1) {
            this.isBranch = true;
        }
    }
    selectBranch(eve) {
        this.studentBatch = null;
        this.studentTargetexam = null;
        this.stdUpdateBatchList = [];
        if (this.institute_type === 'college' || this.institute_type === 'company') {
            this.batchListing = [];
            this.studentBatch = [];
            let alreadySelectedBranch: any = [];
            _.forEach(this.batchlisting, (eachExistingBatch) => {
                if (this.filterBranch.includes(eachExistingBatch.branch_id)) {
                    this.batchListing.push(eachExistingBatch);
                    if (this.alreadySelectedBatch && this.alreadySelectedBatch.includes(eachExistingBatch.value)) {
                        this.studentBatch.push(eachExistingBatch.value);
                        alreadySelectedBranch.push(eachExistingBatch.branch_id);
                    }
                }
            });
            let v: any = [];
            let selectedBatches: any = [];
            alreadySelectedBranch = _.difference(this.filterBranch, alreadySelectedBranch);
            _.forEach(alreadySelectedBranch, (eachSelectedBranch: any) => {
                v = this.batchlisting.filter((element) => {
                    return eachSelectedBranch === element.branch_id;
                });
                if (v && v.length) {
                    selectedBatches = selectedBatches.concat(v);
                }
            });
            if (selectedBatches) {
                selectedBatches = _.map(selectedBatches, 'value');
                this.studentBatch = this.studentBatch.concat(selectedBatches);
            }
            this.studentBatch = _.uniq(this.studentBatch);
            if (this.filterBranch && this.filterBranch.length === 1) {
                this.stdUpdateBatchList = _.filter(this.batchlisting, (element) => {
                    return this.filterBranch[0] === element.branch_id;
                });
            } else {
                this.stdUpdateBatchList = [];
            }
        } else if (this.institute_type === 'training_institute') {
            this.targetExamListing = [];
            this.studentTargetexam = [];
            let alreadySelectedTarget: any = [];
            _.forEach(this.targetexamlisting, (eachExistingBatch) => {
                if (this.filterBranch.includes(eachExistingBatch.branch_id)) {
                    this.targetExamListing.push(eachExistingBatch);
                    if (this.alreadySelectedTarget && this.alreadySelectedTarget.includes(eachExistingBatch.value)) {
                        this.studentTargetexam.push(eachExistingBatch.value);
                        alreadySelectedTarget.push(eachExistingBatch.branch_id);
                    }
                }
            });
            let v: any = [];
            let selectedTarget: any = [];
            alreadySelectedTarget = _.difference(this.filterBranch, alreadySelectedTarget);
            _.forEach(alreadySelectedTarget, (eachSelectedBranch: any) => {
                v = this.targetexamlisting.filter((element) => {
                    return eachSelectedBranch === element.branch_id;
                });
                if (v && v.length) {
                    selectedTarget = selectedTarget.concat(v);
                }
            });
            if (selectedTarget) {
                selectedTarget = _.map(selectedTarget, 'value');
                this.studentTargetexam = this.studentTargetexam.concat(selectedTarget);
            }
            this.studentTargetexam = _.uniq(this.studentTargetexam);
        }
        this.appliedCount = 0;
        this.page = 1;
        if (eve.value) {
            switch (this.institute_type) {
                case 'college':
                    this.listingdegree();
                    break;
            }
            this.listingdepartment();
        }
        this.paginator.changePage(0);
        this.selectallBranch();
    }
    selectBatch(eve) {
        if (this.checkpath !== '/contests') {
            this.stdUpdateBatchList = [];
            if (this.filterBranch && this.filterBranch.length === 1) {
                this.stdUpdateBatchList = _.filter(this.batchlisting, (element) => {
                    return element.branch_id === this.filterBranch[0];
                });
            } else {
                this.stdUpdateBatchList = [];
            }
            if (this.institute_type === 'college') {
                this.listingdegree();
            }
            this.listingdepartment();
        }
        this.studentDepartment = null;
        this.studentDegree = null;
        this.studentTags = null;
        this.studentStatus = null;
        this.appliedCount = 0;
        this.paginator.changePage(0);
    }
    selectTargetexam() {
        this.studentDepartment = null;
        this.appliedCount = 0;
        this.purpose === 'Exams App' ? this.listingstudent(undefined) : this.ppaStudentList(undefined);
    }
    selectAction(event) {
        if (event.value === 'msg') {
            this.sendMessage();
            return;
        }
        if (this.selectedStudents.length > 0) {
            event.value === 'delete' ? this.showDeleteConfirmation() : this.nothing();
            event.value === 'password' ? this.showDeleteConfirmation() : this.nothing();
            event.value === 'approve' ? this.approveRejectAll('approve') : this.nothing();
            event.value === 'reject' ? this.rejectdialog() : this.nothing();
            event.value === 'mc' ? this.makeCoordinator() : this.nothing();
            event.value === 'resume' ? this.downloadResume() : this.nothing();
            event.value === 'rc' ? this.rmCoordinator() : this.nothing();
            event.value === 'enroll' ? this.enrollConfirm() : this.nothing();
            event.value === 'link' ? this.sendLink() : this.nothing();
            event.value === 'edit' ? this.bulkEditStudent() : this.nothing();
            event.value === 'ab' ? this.addBulkBadges() : this.nothing();
            event.value === 'inactive' ? this.disabledialog() : this.nothing();
            event.value === 'active' ? this.changeDisablePortalAccess('active') : this.nothing();
            event.value === 'cf_file_upload' ? this.downloadCFUploadedFile() : this.nothing();
            event.value === 'drive_disabled' ? this.drivedisabledstudent('disable') : this.nothing();
            event.value === 'drive_enabled' ? this.drivedisabledstudent('enable') : this.nothing();
        } else {
            if (this.selectedAction) {
                this.selectMsg = [];
                this.selectMsg.push({
                    severity: 'error',
                    summary:
                        this.userdata.institute_type !== 'company'
                            ? 'Please select the students'
                            : 'Please select the candidates',
                    detail: 'Failed',
                });
                setTimeout(() => {
                    this.selectedAction = null;
                }, 100);
            }
        }
    }
    rejectdialog() {
        this.isReject = true;
    }
    drivedisabledstudent(decisiontype) {
        let reject = _.filter(this.selectedStudents, (o) => {
            return o.markData && o.markData.verification_status !== 3 ? o : null;
        });
        this.selectedStudents = _.filter(this.selectedStudents, (o) => {
            return o.markData && o.markData.verification_status > 1 ? o : null;
        });
        if(reject.length > 0){
            this.ppaStudentList(undefined);
            this.selectedAction = null;
            this.selectedStudents = [];
            this.stdAction.clear(null);
            this.studentsMsg.push({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Some of the selected students are not in Approved state',
            });
            setTimeout(() => {
                this.studentsMsg = [];
                this.selectedAction = null;
            }, 3000);
        }
        else if(this.selectedStudents && this.selectedStudents.length > 0){
            const user_ids = JSON.stringify(_.map(this.selectedStudents, 'markData.s_profile_id'));
            let payload : any = {
                user_id : user_ids,
                school_id : this.school_id,
                decision: decisiontype,
            }
            this.call17 = this.UsersService.drivesDisable(payload).subscribe((res: any) => {
                if(res.success){
                    this.ppaStudentList(undefined);
                    this.selectedAction = null;
                    this.selectedStudents = [];
                    this.stdAction.clear(null);
                    setTimeout(() => {
                        this.studentsMsg = [];
                        const decision = decisiontype === 'enable' ? 'Enable' : 'Disabled';
                        this.studentsMsg.push({
                            severity: 'success',
                            summary: decision,
                            detail: 'Selected Students has been ' + decision + ' from '+this.drivesService.drivesNameFormatView.drivesNamelist.label,
                        });
                    }, 500);
                    setTimeout(() => {
                        this.studentsMsg = [];
                    }, 3000);
                }
                else if(!res.success && res.message ==='Student is not disabled in drives'){
                    this.selectedAction = null;
                    this.selectedStudents = [];
                    this.uncheckAll();
                    setTimeout(() => {
                        this.studentsMsg = [];
                        this.studentsMsg.push({
                            severity: 'error',
                            summary: 'Failed!',
                            detail: 'Selected Students has not been Disabled from '+this.drivesService.drivesNameFormatView.drivesNamelist.label,
                        });
                    }, 500);
                    setTimeout(() => {
                        this.studentsMsg = [];
                    }, 3000);
                }
                else {
                    this.selectedAction = null;
                    this.selectedStudents = [];
                    this.uncheckAll();
                }
            });
        }
        else{
            this.studentsMsg = [];
            this.studentsMsg.push({
                severity: 'error',
                summary: 'Failed',
                detail: 'Something went wrong please try again later',
            });
            this.selectedAction = null;
            this.stdAction.clear(null);
            this.selectedStudents = [];
            this.uncheckAll();
            setTimeout(() => {
                this.studentsMsg = [];
                this.selectedAction = null;
            }, 3000);
        }
    }
    disabledialog() {
        this.isDisable = true;
    }
    rejectStudent() {
        this.approveRejectAll('reject');
    }
    DisableStudent() {
        this.changeDisablePortalAccess('inactive');        
    }
    hideReject() {
        this.ppaStudentList(undefined);
        this.selectedAction = null;
        this.selectedStudents = [];
        this.stdAction.clear(null);
        this.rejectText = '';
        this.rejectResonStudentDisplay = false;
        this.isReject = false;
    }
    hideDisable() {
        this.ppaStudentList(undefined);
        this.selectedAction = null;
        this.selectedStudents = [];
        this.stdAction.clear(null);
        this.disableText = '';
        this.disableResonStudentDisplay = false;
        this.disableResonStudentDisplayemail = false;
        this.isDisable = false;
    }
  
    sendLink() {
        if (this.selectAllFlag) {
            this.selectedAction = null;
            this.selectedStudents = [];
            this.uncheckAll();
            this.UsersService.bulk_resendLink(this.payloadGenerator()).subscribe((response: any) => {
                this.checkResponse(response.success);
            });
        } else {
            let emailIds = [];
            emailIds = _.map(this.selectedStudents, 'email');
            const payload = {
                email: emailIds,
                school_code: this.schoolData.school_code,
                googleToken: '',
            };
            this.UsersService.getCaptchaToken('resetLink').then((googleCaptcha: any) => {
                payload.googleToken = googleCaptcha;
                this.call10 = this.UsersService.resendLink(payload).subscribe((response: any) => {
                    this.checkResponse(response.success);
                });
            });
        }
    }
    checkResponse(response) {
        if (response) {
            this.selectedAction = null;
            this.selectedStudents = [];
            this.uncheckAll();
            let growlrole;
            this.institute_type === 'company' ? (growlrole = 'Candidates') : (growlrole = 'Students');
            this.selectMsg = [];
            this.selectMsg.push({
                severity: 'success',
                summary: 'Activation Link',
                detail: 'Successfully send to the invited ' + growlrole,
            });
        } else {
            let growlrole;
            this.institute_type === 'company' ? (growlrole = 'Candidates') : (growlrole = 'Students');
            this.selectMsg = [];
            this.selectMsg.push({
                severity: 'error',
                summary: 'Failed!',
                detail: 'Selected ' + growlrole + ' are already joined',
            });
        }
    }
    sendMessage() {
        this.visibleSidebar = true;
        if (this.selectedStudents && this.selectedStudents.length) {
            this.messageType = 'selected';
        } else {
            this.messageType = 'custom';
        }
        if (this.checkpath === '/contests' || this.checkpath === '/course') {
            this.pathPay.checkpath = this.checkpath;
            this.pathPay.c_id = this.c_id ? this.c_id : null;
            this.pathPay.isCustomMail = true;
        }
        if (this.selectAllFlag) {
            this.selectedStudents = [];
            this.selectedStudents = this.selectedStudents.concat(this.studentListData);
        }
    }
    // uploademailFile() {
    //   return new Promise(res => {
    //     const fields = [];
    //     this.loadingSend = true;
    //     if (this.filename) {
    //       const payload = {
    //         file_name: 'email-uploads/' + this.school_id + '/' + this.Filename,
    //         type: this.filename.type,
    //         publickey: true
    //       };
    //       this.UploadFileService.getSignedUrl(payload).subscribe((response: any) => {
    //         const json = response;
    //         this.UploadFileService.uploadUsingSignedUrl(json.data.url, this.filename).subscribe((r: any) => {
    //           if (r && r.status === 200) {
    //             // 'exams-asset'
    //             const bucket: string = r.url.split('.amazonaws')[0].split('://')[1].split('.')[0];
    //             const s3_url = 'https://s3.amazonaws.com/' + bucket + '/' + payload.file_name;
    //             if (s3_url) {
    //               fields.push({
    //                 uploadUrl: s3_url
    //               });
    //               res(fields);
    //             } else {
    //               res(fields);
    //             }
    //           }
    //         });
    //       });
    //     } else {
    //       res([]);
    //     }
    //   });
    // }
    validateFile(event) {
        if (event.target.files && event.target.files[0]) {
            this.filename = event.target.files[0];
            if (this.filename.size / 1000 <= 2048) {
                this.Filename = this.filename.name;
                this.Filesize = '  ' + (this.filename.size / 1000).toFixed(2) + 'kb';
            } else {
                this.errormsg();
                this.selectMsg = [];
                this.selectMsg.push({
                    severity: 'failed',
                    summary: 'File size less than 2mb',
                    detail: 'maximum file size limit is 2 MB',
                });
            }
        }
    }
    removefile(event) {
        event.target.value = null;
    }
    deleteFile() {
        // maximum file size limit is 1 MB
        this.errormsg();
        this.selectMsg = [];
        this.selectMsg.push({
            severity: 'failed',
            summary: 'File delete',
            detail: 'Successfully file deleted',
        });
    }
    errormsg() {
        this.Filename = null;
        this.Filesize = null;
        this.filename = null;
    }
    // saveMsg() {
    //   this.uploademailFile().then((file) => {
    //     this.sendMsg(file);
    //   });
    // }
    // sendMsg(file) {
    //   if (this.filterBranch && this.filterBranch.length) {
    //     this.loadingSend = true;
    //     let errormsg = false;
    //     let typeofmsg;
    //     if (this.emailSubject) {
    //       this.emailSubject = this.emailSubject.replace(/\&nbsp;/g, '');
    //     }
    //     if (this.emailcheck && this.pushcheck) {
    //       typeofmsg = 'Both';
    //       if (!this.emailbody || !this.emailSubject || !this.pushmsg || !this.pushtitle) {
    //         errormsg = true;
    //       } else {
    //         errormsg = false;
    //       }
    //     }
    //     if (this.emailcheck && !this.pushcheck) {
    //       typeofmsg = 'Email';
    //       errormsg = (!this.emailbody || !this.emailSubject) ?  true : false;
    //     }
    //     if (!this.emailcheck && this.pushcheck) {
    //       typeofmsg = 'Push';
    //       errormsg = (!this.pushmsg || !this.pushtitle) ?  true : false;
    //     }
    //     if (this.pushcheck) {
    //       const urlRex = /(https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    //       if (this.pushurl && !urlRex.test(this.pushurl)) {
    //         this.urlError = true;
    //         errormsg = true;
    //       } else {
    //         this.urlError = false;
    //       }
    //     }
    //     const email_ids = [];
    //     const branch_id = [];
    //     const receiver_name = [];
    //     const depart_id = [];
    //     const tar_id = [];
    //     const deg_id = [];
    //     const bat_id = [];
    //     _.forEach(this.selectedStudents, (students: any) => {
    //       email_ids.push(students.email);
    //       receiver_name.push(students.name);
    //       if (students.branch_id && students.branch_id.length > 0) {
    //         _.forEach(students.branch_id, (one) => {
    //           branch_id.push(one);
    //         });
    //       }
    //       depart_id.push(students.department_id);
    //       deg_id.push(students.degree_id);
    //       tar_id.push(students.target_id);
    //       if (students.batch && students.batch.batch_id) {
    //         bat_id.push(students.batch.batch_id);
    //       }
    //     });
    //     const payload = {
    //       school_id: this.school_id,
    //       branch_id: _.uniq(branch_id),
    //       degree_id: _.uniq(deg_id),
    //       batch_id: _.uniq(bat_id),
    //       department_id: _.uniq(depart_id),
    //       target_exam_id: _.uniq(tar_id),
    //       type: typeofmsg,
    //       sender_img: this.sender_img,
    //       namelist: receiver_name,
    //       receiver_email_id: email_ids,
    //       email_subject: this.emailSubject,
    //       email_body: this.emailbody,
    //       push_message: this.pushmsg,
    //       push_url: this.pushurl,
    //       push_title: this.pushtitle,
    //       sender_id: this.user_id,
    //       sender_email_id: this.email_id,
    //       sender_name: this.username,
    //       date: new Date(),
    //       email_link: file && file.length && file[0].uploadUrl ?
    //         file[0].uploadUrl : ''
    //     };
    //     const temp_payload = {
    //       school_id: this.school_id,
    //       branch_ids: _.uniq(branch_id),
    //       receiver_email_id: this.messageType === 'custom' ? this.customEmailList : email_ids,
    //       email_subject: this.emailSubject,
    //       email_body: this.emailbody,
    //       email_link: file && file.length && file[0].uploadUrl ?
    //         file[0].uploadUrl : ''
    //     };
    //     if (typeofmsg && !errormsg) {
    //       const promises_array: Array<any> = [];
    //       if (typeofmsg === 'Both' || typeofmsg === 'Email') {
    //         promises_array.push(
    //           new Promise((resolveedf, resolvese) => {
    //             if (this.selectAllFlag && this.messageType === 'selected') {
    //               const payloadEmail = this.payloadGenerator();
    //               payloadEmail.email_subject = this.emailSubject;
    //               payloadEmail.email_body = this.emailbody;
    //               payloadEmail.email_link = file && file.length && file[0].uploadUrl ? file[0].uploadUrl : '';
    //               payloadEmail.isPlacementInterested = this.isPlacementInterested;
    //               if (this.checkpath === '/contests' || this.checkpath === '/course') {
    //                 payloadEmail.c_id = this.c_id ? this.c_id : null;
    //                 payloadEmail.isCustomMail = true;
    //               }
    //               this.UsersService.selectallCustomMessaging(payloadEmail).subscribe((response: any) => {
    //                 if (response.success) {
    //                   payload.receiver_email_id = response.data;
    //                   payload.namelist = response.name;
    //                   this.emailSubject = null;
    //                   this.emailbody = null;
    //                   resolveedf(true);
    //                 }
    //               });
    //             } else {
    //               this.call11 = this.UsersService.customMessaging(temp_payload).subscribe((response: any) => {
    //                 if (response.success) {
    //                   this.emailSubject = null;
    //                   this.emailbody = null;
    //                   resolveedf(true);
    //                 }
    //               });
    //             }
    //           }));
    //       }
    //       if (typeofmsg === 'Both' || typeofmsg === 'Push') {
    //         promises_array.push(
    //           new Promise((resolveedf, resolvese) => {
    //             this.uploadPushImageS3().then(s3url => {
    //               const pushpayload: any = {
    //                 school_id: this.school_id,
    //                 email_ids: this.messageType === 'custom' ? this.customEmailList: email_ids,
    //                 title: this.pushtitle,
    //                 body: this.pushmsg,
    //                 click_url: this.pushurl
    //               };
    //               if (s3url) {
    //                 pushpayload.image = s3url;
    //               }
    //               if (this.selectAllFlag && this.messageType === 'custom') {
    //                 const payloadPush: any = this.payloadGenerator();
    //                 payloadPush.title = this.pushtitle;
    //                 payloadPush.body = this.pushmsg;
    //                 payloadPush.click_url = this.pushurl;
    //                 if (this.checkpath === '/contests' || this.checkpath === '/course') {
    //                   payloadPush.c_id = this.c_id ? this.c_id : null;
    //                   payloadPush.isCustomMail = true;
    //                 }
    //                 if (s3url) {
    //                   payloadPush.image = s3url;
    //                 }
    //                 this.UsersService.selectAallPushmessaging(payloadPush).subscribe((response: any) => {
    //                   if (response.success) {
    //                     payload.receiver_email_id = response.data;
    //                     payload.namelist = response.name;
    //                     this.pushmsg = null;
    //                     this.pushtitle = null;
    //                     this.pushurl = null;
    //                     this.pushImage = [];
    //                     if (this.uploadFile) {
    //                       this.uploadFile.clear();
    //                     }
    //                     resolveedf(true);
    //                   }
    //                 });
    //               } else {
    //                 this.UsersService.sendPushDetails(pushpayload).subscribe((response) => {
    //                   this.pushmsg = null;
    //                   this.pushtitle = null;
    //                   this.pushurl = null;
    //                   this.pushImage = [];
    //                   if (this.uploadFile) {
    //                     this.uploadFile.clear();
    //                   }
    //                   resolveedf(true);
    //                 });
    //               }
    //             });
    //           }));
    //       }
    //       Promise.all(promises_array).then((final: any) => {
    //         this.loadingSend = false;
    //         this.visibleSidebar = false;
    //         this.selectMsg = [];
    //         let growlrole;
    //         this.institute_type === 'company' ? growlrole = 'Candidates' : growlrole = 'Students';
    //         this.selectMsg
    //           .push({
    //             severity: 'success', summary: 'Message Sent',
    //             detail: 'Successfully Send to ' + growlrole
    //           });
    //         this.uncheckAll();
    //         this.selectedStudents = [];
    //         const api_url = environment.HOST.link;
    //         if (api_url.includes('.io')) {
    //           this.bucket = 'exams-media';
    //         } else {
    //           this.bucket = 'exams-media-stage';
    //         }
    //         const requiredPay: any = {
    //           school_id: this.school_id,
    //           user_id: this.user_id,
    //           s3Path: `Custom_Msg/Verison2/${this.school_id}/${this.user_id}/${new Date()}`,
    //           bucket: this.bucket
    //         };
    //         this.StaffStudentService.addCustomMessage(payload, requiredPay).subscribe((response: any) => {
    //         });
    //         setTimeout(() => {
    //           this.selectedAction = null;
    //         }, 100);
    //       });
    //     } else {
    //       this.loadingSend = false;
    //       this.selectMsg = [];
    //       this.selectMsg
    //         .push({
    //           severity: 'error', summary: 'Validation Failed',
    //           detail: 'Enter All Requried Fields'
    //         });
    //     }
    //   } else {
    //     this.selectMsg = [];
    //     this.selectMsg
    //       .push({
    //         severity: 'warn', summary: 'Warning',
    //         detail: 'Please select atleast one ' + this.Branch + ' send message'
    //       });
    //   }
    // }
    // closemsg() {
    //   this.visibleSidebar = false;
    //   setTimeout(() => {
    //     this.selectedAction = null;
    //   }, 100);
    //   this.selectedStudents = [];
    //   this.emailSubject = null;
    //   this.emailbody = null;
    //   this.pushcheck = false;
    //   this.pushmsg = null;
    //   this.pushurl = null;
    //   this.pushtitle = null;
    //   this.customValid = false;
    //   this.customEmails = '';
    //   this.customEmailList = [];
    //   this.customEmailInvalid = false;
    //   this.errormsg();
    //   this.uncheckAll();
    // }
    enrollviabtn() {
        if (this.selectAllFlag) {
            this.enrollAllStudents();
        } else {
            if (this.selectedStudents.length > 0) {
                this.enrollStudents();
            } else {
                this.selectMsg = [];
                this.selectMsg.push({
                    severity: 'error',
                    summary:
                        this.userdata.institute_type !== 'company'
                            ? 'Please select the students'
                            : 'Please select the candidates',
                    detail: 'Failed',
                });
            }
        }
    }
    enrollConfirm() {
        if (this.selectedStudents.length === 0) {
            this.studentsMsg = [];
            this.studentsMsg.push({
                severity: 'error',
                summary: 'Failed!',
                detail:
                    this.userdata.institute_type !== 'company'
                        ? 'Please select the students'
                        : 'Please select the candidates',
            });
            setTimeout(() => {
                this.studentsMsg = [];
            }, 3000);
            return;
        }
        this.checkpath === '/course'
            ? (this.activateHeader = 'Enroll Confirmation')
            : (this.activateHeader = 'Invite Confirmation');
        this.isActiveRdeactiveConfirm = true;
        setTimeout(() => {
            this.selectedAction = null;
        }, 100);
    }
    closeEnableConfirm() {
        this.selectedAction = null;
        this.isActiveRdeactiveConfirm = false;
    }
    enrollStudents() {
        this.isActiveRdeactiveConfirm = false;
        if (this.selectAllFlag) {
            this.enrollAllStudents();
        } else {
            const payload = {
                users: [],
                department_id: [],
                branch_id: [],
            };
            this.selectedStudents.forEach((val) => {
                console.log(val);
                payload.users.push({ user_id: val.id, email: val.email });
            });
             payload.department_id = this.departmentId[0];
             payload.branch_id = this.branchId[0];
            if (typeof payload.branch_id === 'string') {
                payload.branch_id = [payload.branch_id];
            }
            if (typeof payload.department_id === 'string') {
                payload.department_id = [payload.department_id];
            }
            this.loadingBtn = true;
            this.courseCreationService.enrollingStudents(payload).subscribe((response: any) => {
                this.loadingBtn = false;
                if (response.success) {
                    this.studentsMsg = [];
                    const msgtxt = this.institute_type !== 'company' ? ' students' : ' candidates';
                    let growlval =
                        this.checkpath === '/course'
                            ? 'Selected' + msgtxt + ' have been enrolled'
                            : 'Selected' + msgtxt + 'students have been invited';
                    if (this.checkpath === '/contests') {
                        growlval = 'Selected' + msgtxt + ' have been invited. Kindly check after sometime.';
                    }
                    this.studentsMsg.push({ severity: 'success', summary: 'Details Updated', detail: growlval });
                    setTimeout(() => {
                        this.studentsMsg = [];
                    }, 3000);
                    this.selectedAction = null;
                    this.selectedStudents = [];
                    this.uncheckAll();
                } else {
                    this.studentsMsg = [];
                    this.studentsMsg.push({
                        severity: 'error',
                        summary: 'Please enter all the necessary fields',
                        detail: 'Validation failed',
                    });
                    setTimeout(() => {
                        this.studentsMsg = [];
                    }, 3000);
                }
            });
            // setTimeout(() => {
            //   this.studentsMsg.pop();
            // }, 3000);
            this.closeDeleteConfirmation();
            this.selectedStudents = [];
        }
    }
    showDeleteConfirmation() {
        if (this.selectedAction === 'password') {
            this.isDeleteConfirm = true;
        } else {
            this.isDeleteConfirm = true;
        }
    }
    closeDeleteConfirmation() {
        this.isDeleteConfirm = false;
        this.selectedAction = null;
        this.selectedStudents = [];
        this.uncheckAll();
    }
    paginate(event) {
        // this.paginator.changePage(event.page);
        this.purpose === 'Exams App' ? this.listingstudent(event.page + 1) : this.ppaStudentList(event.page + 1);
    }
    getAllTags() {
        this.tagsList = [];
        const payload = {
            school_id: this.school_id,
            user_role: 'Student',
        };
        this.UsersService.getAllTags(payload).subscribe((response: any) => {
            for (const o of response) {
                if (o.tag_id) {
                    this.tagsList.push({ label: o.tags.name, value: o.tag_id });
                }
            }
        });
    }
    checkAll(event) {
        this.selectedStudents = [];
        if (event) {
            this.checkedAll = true;
            for (const q of this.studentListData) {
                q.check = true;
                this.selectedStudents.push(q);
            }
            const temparray = _.cloneDeep(this.studentListData);
            if (!this.searchTerm) {
                this.selectedStudents = _.slice(temparray, this.startIndex, this.startIndex + this.rowsLimit);
            } else {
                this.selectedStudents = _.slice(temparray, 0, this.rowsLimit);
            }
        } else {
            this.checkedAll = false;
            for (const q of this.studentListData) {
                q.check = false;
            }
        }
    }
    checked(carValue) {
        if (carValue.check) {
            this.selectedStudents.push(carValue);
            if (this.selectedStudents.length === this.studentListData.length) {
                this.checkedAll = true;
            }
        } else {
            this.selectAllFlag = false;
            const i = _.findIndex(this.selectedStudents, { id: carValue.id });
            this.checkedAll = false;
            if (i !== -1) {
                this.selectedStudents.splice(i, 1);
            }
            if (this.selectedStudents.length < this.studentListData.length) {
                this.checkedAll = false;
            }
        }
    }
    uncheckAll() {
        this.selectedStudents = [];
        this.selectAllFlag = false;
        this.checkedAll = false;
        for (const q of this.studentListData) {
            q.check = false;
        }
    }
    sortColumn(event) {
        const temparray = [
            'name',
            'email',
            'department',
            'degree',
            'tenth',
            'twelfth',
            'diploma',
            'ug',
            'branch',
            'pg',
            'currentBack',
            'roll_no',
            'phoneno',
            'application_no'
        ];
        this.sortvalue = !event.order;
        if (_.includes(temparray, event.field)) {
            this.sortOrder = !this.sortOrder;
            this.sortby = event.field;
            this.purpose === 'Exams App' ? this.listingstudent(undefined) : this.ppaStudentList(undefined);
        } else {
            this.sortby = undefined;
        }
    }
    ppaStudentList(p) {
        this.uncheckAll();
        this.getUsers();
        this.checkedAll = false;
        this.emptyMessage = 'Loading...';
        this.studentCount = this.studentcount;
       this.filterData = [];
        this.studentListData = [];
        // if ((this.studentcount !== 0) && this.studentcount / this.rowsLimit < 1) {
        //   this.page = Math.ceil(this.studentcount / this.rowsLimit);
        // }
        this.alreadySelectedBatch = this.studentBatch;
        const payload: any = {
            page: p ? p : this.page,
            page_limit: this.rowsLimit,
            department: this.studentDepartment,
            enrolled_status: this.studentEnrollstatus,
            tags: this.studentTags,
            batch: this.studentBatch,
            degree: this.studentDegree,
            isPortalAccess: this.isShowInactive,
            search: this.searchTerm,
            school_id: this.school_id,
            isDrivePortalAccess: this.isDriveInactive,
            isPlacementInterested: this.isPlacementInterested,
            user_role: 'student',
            verification_status: this.studentStatus,
            purpose: this.purpose,
            all_branches: _.compact(_.map(this.branchList, 'value')),
            ifinmainDepartment: _.find(this.departmentlist, (each: any) => {
                return each.label.includes('admin') || each.label.includes('HR');
            })
                ? true
                : false,
        };
        if (this.checkpath === '/course') {
            if (this.filterBranch && this.filterBranch.length) {
                payload.branch_id = this.filterBranch;
            } else {
                payload.all_branches = this.branchId;
                payload.all_batches = this.batchIds && this.batchIds.length ? this.batchIds : [];
                this.selectMsg = [];
                this.selectMsg.push({
                    severity: 'warn',
                    summary: 'Warning!',
                    detail: 'Please select one ' + this.Branch,
                });
                this.emptyMessage = 'No records found';
                return;
            }
        } else {
            payload.branch_id = this.filterBranch;
        }
        if (this.checkpath === '/contests') {
            payload.c_id = this.c_id ? this.c_id : null;
        }
        if (this.sortby) {
            payload.sort_by = this.sortby;
            if (this.sortOrder) {
                payload.sort_order = 'ASC';
            } else {
                payload.sort_order = 'DESC';
            }
        }
        
        this.call2 = this.SettingsService.getStudentlist(payload).subscribe((response: any) => {
            const SL = response;
            this.studentcount = SL.data.count;
            if (SL && SL.data && SL.data.data && SL.data.data.length === 0) {
                this.emptyMessage = 'No records found';
            } else {
                this.emptyMessage = 'No records found';
            }
            this.UsersService.studentCount.next(this.studentcount ? this.studentcount : 0);
            this.studentListData = [];
            this.filterData = [];
            _.forEach(SL.data.data, (o: any) => {
                let checkdrive_disable : any = false;
                if(o.student_ppa_profiles && o.student_ppa_profiles.reject_reason && o.student_ppa_profiles.reject_reason.disablestudentfordrives === true){
                        checkdrive_disable = true;
                }
                else{
                    checkdrive_disable = false;
                }
                if (o.student_ppa_profiles && o.student_ppa_profiles.verification_status === 1) {
                    o.status = 'Joined';
                } else if (o.student_ppa_profiles && o.student_ppa_profiles.verification_status === 2) {
                    if (this.purpose === 'Recruitment') {
                        o.status = 'Approved';
                    } else {
                        o.status = 'Published';
                    }
                } else if (o.student_ppa_profiles && o.student_ppa_profiles.verification_status === 3) {
                    o.status = checkdrive_disable === true ? 'Approved - '+this.drivesService.drivesNameFormatView.drivesNamelist.label+' Disabled':'Approved';
                } else if (o.student_ppa_profiles && o.student_ppa_profiles.verification_status === 0) {
                    o.status = 'Invited';
                } else {
                    if (this.purpose === 'Recruitment') {
                        o.status = 'Joined';
                    } else {
                        o.status = checkdrive_disable === true ? 'Rejected - '+this.drivesService.drivesNameFormatView.drivesNamelist.label+' Disabled':'Rejected';
                    }
                }
                const ppa: any = o.student_ppa_profiles;
           
                const eachStudent: any = {
                    roll_no:
                        o.student_ppa_profiles && o.student_ppa_profiles.roll_no ? o.student_ppa_profiles.roll_no : '-',
                        reject_reason:
                        o.status === 'Rejected' && o.student_ppa_profiles && o.student_ppa_profiles.reject_reason ? o.student_ppa_profiles.reject_reason.reason_for_reject : '-',                     
                    approvedBy:
                        ppa && ppa.history !== null
                            ? ppa.history[ppa.history.length - 1].approved_by
                                ? this.getName(ppa.history[ppa.history.length - 1].approved_by)
                                : null
                            : null,
                    rejectedBy:
                        ppa && ppa.history !== null
                            ? ppa.history[ppa.history.length - 1].rejectedBy
                                ? this.getName(ppa.history[ppa.history.length - 1].rejectedBy)
                                : null
                            : null,
                    approvedAt:
                        ppa && ppa.history !== null
                            ? ppa.history[ppa.history.length - 1].approvedAt
                                ? this.datePipe.transform(
                                      new Date(ppa.history[ppa.history.length - 1].approvedAt),
                                      'dd/MM/yy HH:mm',
                                  )
                                : null
                            : null,
                    rejectedAt:
                        ppa && ppa.history !== null
                            ? ppa.history[ppa.history.length - 1].rejectedAt
                                ? this.datePipe.transform(
                                      new Date(ppa.history[ppa.history.length - 1].rejectedAt),
                                      'dd/MM/yy HH:mm',
                                  )
                                : null
                            : null,
                    name: o.name ? o.name.split('$')[0] + ' ' + o.name.split('$')[1] : '- ',
                    email: o.email ? o.email : '-',
                    driveCount: o.driveCount ? o.driveCount : '-',
                    placedDriveDetails: o.placedDriveDetails && o.placedDriveDetails.length ? o.placedDriveDetails : [],
                    phoneno: o.phone ? o.phone : '-',
                    dob: o.dob ? o.dob.substring(0, 10) : '-',
                    badge: o.badge,
                    superbadge: o.superbadge,
                    profile_pic: o.profile_pic,
                    verified_pic: o.verified_pic ? o.verified_pic : undefined,
                    branch: [],
                    branch_id: [],
                    batch: [],
                    batch_id: [],
                    degree: [],
                    degree_id: [],
                    targetexam: [],
                    target_id: [],
                    department: [],
                    department_id: [],
                    role: '-',
                    id: o.user_id,
                    isDeletable: o.isDeletable,
                    status: o.status,
                    gender: o.gender,
                    coordinator:
                        o.school_branch_department_users && o.school_branch_department_users.length > 0
                            ? o.school_branch_department_users[0].special_permission * 1
                            : 0,
                    markData: o.student_ppa_profiles,
                    changesPresent: o.student_ppa_profiles && o.student_ppa_profiles.recent_change,
                    changes:
                        o.student_ppa_profiles &&
                        o.student_ppa_profiles.recent_change &&
                        o.student_ppa_profiles.recent_change.changes &&
                        Object.keys(o.student_ppa_profiles.recent_change.changes).length
                            ? true
                            : false,
                    tenth:
                        o.student_ppa_profiles &&
                        o.student_ppa_profiles.tenth_marks !== null &&
                        (o.student_ppa_profiles.tenth_marks || o.student_ppa_profiles.tenth_marks === 0)
                            ? o.student_ppa_profiles.tenth_marks
                            : 'Not Applicable',
                    is_tenth_percentage:
                        o.student_ppa_profiles &&
                        o.student_ppa_profiles.tenth_marks !== null &&
                        (o.student_ppa_profiles.tenth_marks || o.student_ppa_profiles.tenth_marks === 0)
                            ? o.student_ppa_profiles.is_tenth_percentage
                            : 'Not Applicable',
                    twelfth:
                        o.student_ppa_profiles &&
                        o.student_ppa_profiles.twelfth_marks !== null &&
                        (o.student_ppa_profiles.twelfth_marks || o.student_ppa_profiles.twelfth_marks === 0)
                            ? o.student_ppa_profiles.twelfth_marks
                            : 'Not Applicable',
                    is_twelfth_percentage:
                        o.student_ppa_profiles &&
                        o.student_ppa_profiles.twelfth_marks !== null &&
                        (o.student_ppa_profiles.twelfth_marks || o.student_ppa_profiles.twelfth_marks === 0)
                            ? o.student_ppa_profiles.is_twelfth_percentage
                            : 'Not Applicable',
                    diploma:
                        o.student_ppa_profiles &&
                        o.student_ppa_profiles.diploma_marks !== null &&
                        (o.student_ppa_profiles.diploma_marks || o.student_ppa_profiles.diploma_marks === 0)
                            ? o.student_ppa_profiles.diploma_marks
                            : 'Not Applicable',
                    is_diploma_percentage:
                        o.student_ppa_profiles &&
                        o.student_ppa_profiles.diploma_marks !== null &&
                        (o.student_ppa_profiles.diploma_marks || o.student_ppa_profiles.diploma_marks === 0)
                            ? o.student_ppa_profiles.is_diploma_percentage
                            : 'Not Applicable',
                    ug:
                        o.student_ppa_profiles &&
                        o.student_ppa_profiles.ug_marks !== null &&
                        (o.student_ppa_profiles.ug_marks || o.student_ppa_profiles.ug_marks === 0)
                            ? o.student_ppa_profiles.ug_marks
                            : 'Not Applicable',
                    is_ug_percentage:
                        o.student_ppa_profiles &&
                        o.student_ppa_profiles.ug_marks !== null &&
                        (o.student_ppa_profiles.ug_marks || o.student_ppa_profiles.ug_marks === 0)
                            ? o.student_ppa_profiles.is_ug_percentage
                            : null,
                    pg:
                        o.student_ppa_profiles &&
                        o.student_ppa_profiles.pg_marks !== null &&
                        (o.student_ppa_profiles.pg_marks || o.student_ppa_profiles.pg_marks === 0)
                            ? o.student_ppa_profiles.pg_marks
                            : 'Not Applicable',
                    is_pg_percentage:
                        o.student_ppa_profiles &&
                        o.student_ppa_profiles.pg_marks !== null &&
                        (o.student_ppa_profiles.pg_marks || o.student_ppa_profiles.pg_marks === 0)
                            ? o.student_ppa_profiles.is_pg_percentage
                            : null,
                    currentBack:
                        o.student_ppa_profiles &&
                        o.student_ppa_profiles.current_backlogs !== null &&
                        (o.student_ppa_profiles.current_backlogs || o.student_ppa_profiles.current_backlogs === 0)
                            ? o.student_ppa_profiles.current_backlogs
                            : 'Not Applicable',
                    backlog:
                        o.student_ppa_profiles && o.student_ppa_profiles.backlog_history
                            ? o.student_ppa_profiles.backlog_history
                                ? 'Yes'
                                : 'Not Applicable'
                            : o.student_ppa_profiles && o.student_ppa_profiles.backlog_history === false
                            ? 'No'
                            : 'Not Applicable',
                    interested:
                        o.student_ppa_profiles && o.student_ppa_profiles.interested_for_placement
                            ? o.student_ppa_profiles.interested_for_placement
                                ? 'Yes'
                                : 'Not Applicable'
                            : o.student_ppa_profiles && o.student_ppa_profiles.interested_for_placement === false
                            ? 'No'
                            : 'Not Applicable',
                };
                if (this.schoolData.school_code === 'sambhram' || this.schoolData.school_code === 'nstech196') {
                    if (o.application_no && o.application_no < 10) {
                        o.application_no = 'SUB/IFB-001/000'+ o.application_no;
                    } else if (o.application_no && o.application_no < 100) {
                        o.application_no = 'SUB/IFB-001/00'+ o.application_no;
                    } else if (o.application_no && o.application_no < 1000) {
                        o.application_no = 'SUB/IFB-001/0'+ o.application_no;
                    } else if (o.application_no) {
                        o.application_no = 'SUB/IFB-001/'+ o.application_no;
                    }
                    eachStudent.application_no = o.application_no ? o.application_no : '-'    
                } else {
                    eachStudent.application_no = '-';
                }
                if (o.school_branch_department_users && o.school_branch_department_users.length) {
                    eachStudent.branch_id = _.map(o.school_branch_department_users, 'branch_id');
                    eachStudent.department_id = _.map(o.school_branch_department_users, 'department_id');
                    eachStudent.batch_id = _.map(o.school_branch_department_users, 'batch');
                    eachStudent.degree_id = _.map(o.school_branch_department_users, 'degree_id');
                    eachStudent.target_id = _.map(o.school_branch_department_users, 'targetexam_id');
                    eachStudent.branch = _.map(o.school_branch_department_users, 'school_branches.branch_name');
                    eachStudent.branch = _.join(eachStudent.branch, ', ');
                    eachStudent.department = _.map(
                        o.school_branch_department_users,
                        'school_branch_department.department_name',
                    );
                    eachStudent.department = _.join(eachStudent.department, ', ');
                    if (o.school_branch_department_users[0].school_batches) {
                        eachStudent.batch = _.map(o.school_branch_department_users, 'school_batches.batch');
                        eachStudent.batch = _.join(eachStudent.batch, ', ');
                    } else {
                        eachStudent.batch = '';
                    }
                    if (o.school_branch_department_users[0].school_degrees) {
                        eachStudent.degree = _.map(o.school_branch_department_users, 'school_degrees.degree');
                        eachStudent.degree = _.join(eachStudent.degree, ', ');
                    } else {
                        eachStudent.degree = '';
                    }
                    if (o.school_branch_department_users[0].school_targetexam) {
                        eachStudent.targetexam = _.map(
                            o.school_branch_department_users,
                            'school_targetexam.targetexam_name',
                        );
                        eachStudent.targetexam = _.join(eachStudent.targetexam, ', ');
                    } else {
                        eachStudent.targetexam = '';
                    }
                }
                if (o.users_has_tags && o.users_has_tags.length > 0) {
                    eachStudent.tag_detail = o.users_has_tags;
                }
                if (o.student_custom_fields && o.student_custom_fields.length > 0) {
                    eachStudent.student_custom_fields = o.student_custom_fields;
                }
                if (this.isShowInactive || this.isDriveInactive) {
                    eachStudent.portal_status =
                        o.portal_access_status && o.portal_access_status.status ? this.drivesService.drivesNameFormatView.drivesNamelist.label+' Disable' : 'Disable';
                }
                eachStudent.disable_Reason =   o.portal_access_status && o.portal_access_status.disable_Reason ? o.portal_access_status.disable_Reason : '';
                eachStudent.courseCount = o.courseCount;
                if (o.courseCount>0) {
                    eachStudent.Courses = _.join(o.coursenames, ', ');
                } else {
                    eachStudent.Courses = '-';
                }
                if(o && o.student_custom_fields && o.student_custom_fields.length)
                {
                    _.forEach(o.student_custom_fields[0].fields, (obj: any) =>{
                        if(obj && obj.type === 'resume' && obj.answer ){
                            eachStudent.verified_resume = 'Yes';
                        }
                    });
                    if(!eachStudent.verified_resume){
                        eachStudent.verified_resume = 'No';
                    }
                }
                else{
                    eachStudent.verified_resume = 'No';
                }
                
                this.studentListData.push(eachStudent);
                this.filterData.push(eachStudent);
            });
        });
    }
    openRequest(data, s_id, event) {
        event.stopPropagation();
        this.selectedSId = data.markData.s_profile_id;
        const changeData = data.changesPresent.changes;
        this.changesList = [];
        changeData.tenth_marks || changeData.tenth_marks === 0 || changeData.is_tenth_percentage !== undefined
            ? this.changesList.push({
                  temp: '10th',
                  value1:
                      changeData.is_tenth_percentage !== undefined
                          ? changeData.is_tenth_percentage
                              ? 'Percentage'
                              : 'CGPA'
                          : data.markData.is_tenth_percentage
                          ? 'Percentage'
                          : 'CGPA',
                  value2:
                      data.markData.tenth_marks === null || data.markData.tenth_marks === 'NA'
                          ? 'Not Applicable'
                          : data.markData.tenth_marks,
                  value3:
                      (changeData.tenth_mark && changeData.tenth_mark) === 'NA'
                          ? 'Not Applicable'
                          : changeData.tenth_marks || changeData.tenth_marks === 0
                          ? changeData.tenth_marks
                          : data.markData.tenth_marks,
              })
            : this.nothing();
        changeData.twelfth_marks || changeData.twelfth_marks === 0 || changeData.is_twelfth_percentage !== undefined
            ? this.changesList.push({
                  temp: '12th',
                  value1:
                      changeData.is_twelfth_percentage !== undefined
                          ? changeData.is_twelfth_percentage
                              ? 'Percentage'
                              : 'CGPA'
                          : data.markData.is_twelfth_percentage
                          ? 'Percentage'
                          : 'CGPA',
                  value2:
                      data.markData.twelfth_marks === null || data.markData.twelfth_marks === 'NA'
                          ? 'Not Applicable'
                          : data.markData.twelfth_marks,
                  value3:
                      (changeData.twelfth_marks && changeData.twelfth_marks) === 'NA'
                          ? 'Not Applicable'
                          : changeData.twelfth_marks || changeData.twelfth_marks === 0
                          ? changeData.twelfth_marks
                          : data.markData.twelfth_marks,
              })
            : this.nothing();
        changeData.diploma_marks || changeData.diploma_marks === 0 || changeData.is_diploma_percentage !== undefined
            ? this.changesList.push({
                  temp: 'Diploma',
                  value1:
                      changeData.is_diploma_percentage !== undefined
                          ? changeData.is_diploma_percentage
                              ? 'Percentage'
                              : 'CGPA'
                          : data.markData.is_diploma_percentage
                          ? 'Percentage'
                          : 'CGPA',
                  value2:
                      data.markData.diploma_marks === null || data.markData.diploma_marks === 'NA'
                          ? 'Not Applicable'
                          : data.markData.diploma_marks,
                  value3:
                      changeData.diploma_marks && changeData.diploma_marks === 'NA'
                          ? 'Not Applicable'
                          : changeData.diploma_marks || changeData.diploma_marks === 0
                          ? changeData.diploma_marks
                          : data.markData.diploma_marks,
              })
            : this.nothing();
        changeData.ug_marks || changeData.ug_marks === 0 || changeData.is_ug_percentage !== undefined
            ? this.changesList.push({
                  temp: 'UG',
                  value1:
                      changeData.is_ug_percentage !== undefined
                          ? changeData.is_ug_percentage
                              ? 'Percentage'
                              : 'CGPA'
                          : data.markData.is_ug_percentage
                          ? 'Percentage'
                          : 'CGPA',
                  value2:
                      data.markData.ug_marks === null || data.markData.ug_marks === 'NA'
                          ? 'Not Applicable'
                          : data.markData.ug_marks,
                  value3:
                      changeData.ug_marks && changeData.ug_marks === 'NA'
                          ? 'Not Applicable'
                          : changeData.ug_marks || changeData.ug_marks === 0
                          ? changeData.ug_marks
                          : data.markData.ug_marks,
              })
            : this.nothing();
        changeData.pg_marks || changeData.pg_marks === 0 || changeData.is_pg_percentage !== undefined
            ? this.changesList.push({
                  temp: 'PG',
                  value1:
                      changeData.is_pg_percentage !== undefined
                          ? changeData.is_pg_percentage
                              ? 'Percentage'
                              : 'CGPA'
                          : data.markData.is_pg_percentage
                          ? 'Percentage'
                          : 'CGPA',
                  value2:
                      data.markData.pg_marks === null || data.markData.pg_marks === 'NA'
                          ? 'Not Applicable'
                          : data.markData.pg_marks,
                  value3:
                      changeData.pg_marks && changeData.pg_marks === 'NA'
                          ? 'Not Applicable'
                          : changeData.pg_marks || changeData.pg_marks === 0
                          ? changeData.pg_marks
                          : data.markData.pg_marks,
              })
            : this.nothing();
        changeData.current_backlogs || changeData.current_backlogs === 0
            ? this.changesList.push({
                  temp: 'Current Backlogs',
                  value1: ' - ',
                  value2: data.markData.current_backlogs === null ? 'Not Applicable' : data.markData.current_backlogs,
                  value3:
                      changeData.current_backlogs || changeData.current_backlogs === 0
                          ? changeData.current_backlogs
                          : data.markData.current_backlogs,
              })
            : this.nothing();
        changeData.backlog_history !== null && changeData.backlog_history !== undefined
            ? this.changesList.push({
                  temp: "Backlogs' history",
                  value1: ' - ',
                  value2:
                      data.markData.backlog_history !== null
                          ? data.markData.backlog_history
                              ? 'Yes'
                              : 'No'
                          : 'Not Applicable',
                  value3:
                      changeData.backlog_history !== null
                          ? changeData.backlog_history
                              ? 'Yes'
                              : 'No'
                          : data.markData.backlog_history
                          ? 'Yes'
                          : 'No',
              })
            : this.nothing();
        changeData.interested_for_placement !== null && changeData.interested_for_placement !== undefined
            ? this.changesList.push({
                  temp: 'Interested for Placement',
                  value1: ' - ',
                  value2:
                      data.markData.interested_for_placement !== null
                          ? data.markData.interested_for_placement
                              ? 'Yes'
                              : 'No'
                          : 'Not Applicable',
                  value3:
                      changeData.interested_for_placement !== null
                          ? changeData.interested_for_placement
                              ? 'Yes'
                              : 'No'
                          : data.markData.interested_for_placement
                          ? 'Yes'
                          : 'No',
              })
            : this.nothing();
        this.showRequestTable = true;
    }
    nothing() {
        return 0;
    }
    approveChanges() {
        const payload = {
            decision: 'approve_changes',
            user_id: JSON.stringify([this.selectedSId]),
        };
        this.call12 = this.UsersService.approveReject(payload).subscribe((res) => {
            this.showRequestTable = false;
            this.ppaStudentList(undefined);
        });
    }
    approveRejectAll(decisionVar) {
        let validation = true;
        if (this.selectAllFlag) {
            this.approveRejectAllStudents(decisionVar);
        } else {
            let reject = _.filter(this.selectedStudents, (o) => {
                return o.markData && o.markData.verification_status <= 1 ? o : null;
            });
            
            this.selectedStudents = _.filter(this.selectedStudents, (o) => {
                return o.markData && o.markData.verification_status > 1 ? o : null;
            });
            if (reject && reject.length === 0 && this.selectedStudents && this.selectedStudents.length === 0) {
                this.studentsMsg = [];
                this.studentsMsg.push({
                    severity: 'error',
                    summary: 'Failed',
                    detail: 'Something went wrong please try again later',
                });
                this.selectedAction = null;
                this.stdAction.clear(null);
                this.selectedStudents = [];
                this.uncheckAll();
                setTimeout(() => {
                    this.studentsMsg = [];
                    this.selectedAction = null;
                }, 3000);
            } else {
                if (reject.length) {
                    this.uncheckAll();
                    this.hideReject();
                    this.studentsMsg = [];
                    this.selectedAction = null;
                    this.stdAction.clear(null);
                    reject = [];
                    const msgtxt = this.institute_type !== 'company' ? ' students' : ' candidates';
                    this.studentsMsg.push({
                        severity: 'warn',
                        summary: 'Warning',
                        detail: 'Some of the selected' + msgtxt + ' are in Joined or Invited state',
                    });
                    setTimeout(() => {
                        this.studentsMsg = [];
                        this.selectedAction = null;
                    }, 3000);
                }
                if(
                    (this.rejectResonStudentDisplay === true) &&
                    (this.rejectText && this.rejectText.length === 0)
                )
                    {
                        validation =false;
                        this.studentsMsg.push({
                            severity: 'warn',
                            summary: 'Warning',
                            detail: 'Reason is Required to Display to Students',
                        });

                }
                if (validation && this.selectedStudents.length) {
                    const user_ids = JSON.stringify(_.map(this.selectedStudents, 'markData.s_profile_id'));
                    const payload: any = {
                        decision: decisionVar,
                        user_id: user_ids,
                    };
                    if (this.rejectText && this.rejectText.length !== 0) {
                        payload.reason_for_reject = this.rejectText;
                    }
                    payload.rejectResonStudentDisplay = this.rejectResonStudentDisplay;
                    this.call12 = this.UsersService.approveReject(payload).subscribe((res: any) => {
                        const resp = res;
                        if (resp.success) {
                            this.ppaStudentList(undefined);
                            this.selectedAction = null;
                            this.selectedStudents = [];
                            this.stdAction.clear(null);
                            setTimeout(() => {
                                this.studentsMsg = [];
                                const decision = decisionVar === 'approve' ? 'Approved' : 'Rejected';
                                const msgtxt = this.institute_type !== ' company' ? ' students' : ' candidates';
                                this.studentsMsg.push({
                                    severity: 'success',
                                    summary: decision,
                                    detail: 'Selected' + msgtxt + ' have been ' + decision,
                                });
                            }, 1500);
                            setTimeout(() => {
                                this.studentsMsg = [];
                            }, 3000);
                        } else {
                            this.selectedAction = null;
                            this.selectedStudents = [];
                            this.uncheckAll();
                        }
                    });
                    this.hideReject();
                }
            }
        }
    }
    makeCoordinator() {
        if (this.filterBranch && this.filterBranch.length) {
            if (this.selectAllFlag) {
                this.makeCoordinatorAll();
            } else {
                const payload = {
                    user_id: JSON.stringify(_.map(this.selectedStudents, 'markData.s_profile_id')),
                    branch_id: this.branch_id,
                };
                if (this.filterBranch && this.filterBranch.length) {
                    payload.branch_id = this.filterBranch;
                }
                // const user_ids = JSON.stringify(_.map(this.selectedStudents, 'markData.s_profile_id'));
                this.call13 = this.UsersService.coordinator(payload).subscribe((response: any) => {
                    const resp = response;
                    if (resp.success) {
                        this.ppaStudentList(undefined);
                        this.selectedAction = null;
                        this.selectedStudents = [];
                        this.studentsMsg = [];
                        const msgtxt = this.institute_type !== 'company' ? ' students' : ' candidates';
                        this.studentsMsg.push({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Selected' + msgtxt + ' have been made as co-ordinator',
                        });
                        setTimeout(() => {
                            this.studentsMsg = [];
                        }, 3000);
                    }
                });
            }
        } else {
            this.studentsMsg.push({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please select atleast one' + this.Branch + ' to make coordinator',
            });
            setTimeout(() => {
                this.studentsMsg = [];
            }, 3000);
        }
    }
    changeDisablePortalAccess(type: string) {
        if (this.filterBranch && this.filterBranch.length) {
            if (this.selectAllFlag) {
                this.bulkChangeDisablePortalAccess(type);
            } else {
                const payload: any = {
                    user_id: _.map(this.selectedStudents, 'id'),
                };
                if (type === 'inactive') {
                    payload.isInactive = true;
                } else {
                    payload.isInactive = false;
                }
                if (this.disableText && this.disableText.length !== 0) {
                    payload.disable_Reason = this.disableText;
                }
                payload.disableResonStudentDisplay = this.disableResonStudentDisplay;
                payload.disableResonStudentDisplayemail = this.disableResonStudentDisplayemail;
                payload.school_data = this.schoolData;   
                this.UsersService.changeDisablePortalAccess(payload).subscribe((response: any) => {
                    if (response && response.success) {
                        if (type === 'inactive') {
                            this.showGrowl('success', 'Success', 'Selected students are Disabled');
                        } else {
                            this.showGrowl('success', 'Success', 'Selected students are Enabled');
                        }
                        this.purpose === 'Exams App' ? this.listingstudent(undefined) : this.ppaStudentList(undefined);
                        this.selectedAction = null;
                        this.selectedStudents = [];
                        this.uncheckAll();
                    } else {
                        this.studentsMsg = [];
                        this.studentsMsg.push({
                            severity: 'error',
                            summary: 'Error',
                            detail:
                                'Failed to ' + (type === 'inactive' ? 'Disable' : 'Enable') + ' the selected students',
                        });
                        setTimeout(() => {
                            this.studentsMsg = [];
                        }, 3000);
                        this.selectedAction = null;
                        this.selectedStudents = [];
                        this.uncheckAll();
                    }
                });
            }
        } else {
            this.studentsMsg.push({
                severity: 'warn',
                summary: 'Warning',
                detail:
                    'Please select atleast one ' +
                    this.Branch +
                    ' and ' +
                    (this.institute_type === 'training_institute' ? 'Target Exam' : 'Batch') +
                    ' to ' +
                    (type === 'inactive' ? 'Disable' : 'Enable') +
                    ' students',
            });
            setTimeout(() => {
                this.studentsMsg = [];
            }, 3000);
            this.selectedAction = null;
            this.selectedStudents = [];
            this.uncheckAll();
        }
        this.hideDisable();
    }
    bulkChangeDisablePortalAccess(type: string) {
        if (this.filterBranch && this.filterBranch.length) {
            let payload: any = {
                branch_id: this.filterBranch,
                department: this.studentDepartment,
                enrolled_status: this.studentEnrollstatus,
                tags: this.studentTags,
                batch: this.studentBatch,
                degree: this.studentDegree,
                targetexam_id: this.studentTargetExam,
                search: this.searchTerm,
                school_id: this.school_id,
                user_role: 'student',
                verification_status: this.studentStatus,
                isPlacementInterested: this.isPlacementInterested,
            };
            if (this.isDriveInactive) {
                payload.driveInactive = true;
            } else {
                payload.driveInactive = false;
            }
            if (type === 'inactive') {
                payload.isInactive = true;
            } else {
                payload.isInactive = false;
            }
            payload = _.omitBy(payload, _.isNil);
            this.UsersService.bulkChangeDisablePortalAccess(payload).subscribe(
                (response: any) => {
                    if (response && response.success) {
                        if (type === 'inactive') {
                            this.showGrowl(
                                'success',
                                'Success',
                                'All the students will be disabled.<br>Check after sometime',
                            );
                        } else {
                            this.showGrowl(
                                'success',
                                'Success',
                                'All the students will be enabled.<br>Check after sometime',
                            );
                        }
                        this.purpose === 'Exams App' ? this.listingstudent(undefined) : this.ppaStudentList(undefined);
                        this.selectedAction = null;
                        this.selectedStudents = [];
                        this.uncheckAll();
                    } else {
                        this.showGrowl(
                            'error',
                            'Failed!',
                            'Unable to' + (type === 'inactive' ? 'Disable' : 'Enable') + 'the students ',
                        );
                        this.selectedAction = null;
                        this.selectedStudents = [];
                        this.uncheckAll();
                    }
                },
                (error) => {
                    this.showGrowl(
                        'error',
                        'Unable to' + (type === 'inactive' ? 'Disable' : 'Enable') + ' selected students ',
                        'Something went wrong',
                    );
                    this.selectedAction = null;
                    this.selectedStudents = [];
                    this.uncheckAll();
                },
            );
        } else {
            this.showGrowl(
                'warn',
                'Warning',
                'Please select atleast one ' +
                    this.Branch +
                    ' and ' +
                    (this.institute_type === 'training_institute' ? 'Target Exam' : 'Batch') +
                    ' to ' +
                    (type === 'inactive' ? 'Disable' : 'Enable') +
                    ' students',
            );
            this.selectedAction = null;
            this.selectedStudents = [];
            this.uncheckAll();
        }
    }
    rmCoordinator() {
        if (this.filterBranch && this.filterBranch.length) {
            let payload;
            if (this.selectAllFlag) {
                payload = {
                    user_id: JSON.stringify(_.map(this.studentListData, 'markData.s_profile_id')),
                    branch_id: this.branch_id,
                    department_id: JSON.stringify(_.map(this.studentListData, 'department_id')),
                    school_id: this.school_id,
                };
            } else {
                payload = {
                    user_id: JSON.stringify(_.map(this.selectedStudents, 'markData.s_profile_id')),
                    branch_id: this.branch_id,
                    department_id: JSON.stringify(_.map(this.selectedStudents, 'department_id')),
                    school_id: this.school_id,
                };
            }
            if (this.filterBranch) {
                payload.branch_id = this.filterBranch;
            }
            this.arr = _.map(this.selectedStudents, 'coordinator');
            for (this.i = 0; this.i < this.selectedStudents.length; this.i++) {
                if (!this.arr[this.i]) {
                    this.count++;
                }
            }
            if (!this.count) {
                this.call14 = this.UsersService.rmcoordinator(payload).subscribe((response: any) => {
                    const resp = response;
                    if (resp.success) {
                        this.ppaStudentList(undefined);
                        this.selectedAction = null;
                        this.selectedStudents = [];
                        this.studentsMsg = [];
                        this.studentsMsg.push({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Selected students have been removed from co-ordinator',
                        });
                    }
                });
            } else {
                this.count = 0;
                this.selectMsg = [];
                this.selectMsg.push({
                    severity: 'error',
                    summary: 'Please select coordinators only',
                    detail: 'Failed',
                });
                setTimeout(() => {
                    this.selectedAction = null;
                }, 100);
            }
        } else {
            this.selectMsg = [];
            this.selectMsg.push({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please select atleast one ' + this.Branch + ' to remove coordinator',
            });
            setTimeout(() => {
                this.selectedAction = null;
            }, 100);
        }
    }
    approveSingle(data, index) {
        let key = [];
        this.disableButton = true;
        if (data.temp === '10th') {
            key = ['tenth_marks', 'is_tenth_percentage', 'n_tenth_percentage'];
        } else if (data.temp === '12th') {
            key = ['twelfth_marks', 'is_twelfth_percentage', 'n_twelfth_percentage'];
        } else if (data.temp === 'Diploma') {
            key = ['diploma_marks', 'is_diploma_percentage', 'n_diploma_percentage'];
        } else if (data.temp === 'UG') {
            key = ['ug_marks', 'is_ug_percentage', 'n_ug_percentage'];
        } else if (data.temp === 'PG') {
            key = ['pg_marks', 'is_pg_percentage', 'n_pg_percentage'];
        } else if (data.temp === 'Current Backlogs') {
            key = ['current_backlogs'];
        } else if (data.temp === 'Interested for Placement') {
            key = ['interested_for_placement'];
        } else {
            key = ['backlog_history'];
        }
        const payload = {
            user_id: JSON.stringify([this.selectedSId]),
            decision: 'approve_changes',
            keys: key,
        };
        this.call12 = this.UsersService.approveReject(payload).subscribe((res: any) => {
            const resp = res;
            if (resp.success) {
                this.changesList[index].status = 'A';
                this.disableButton = false;
                this.ppaStudentList(undefined);
                this.selectedAction = null;
                this.selectedStudents = [];
                this.studentsMsg = [];
                this.studentsMsg.push({
                    severity: 'success',
                    summary: 'Approved',
                    detail: 'Changes have been approved',
                });
                setTimeout(() => {
                    this.studentsMsg = [];
                }, 3000);
            }
        });
    }
    rejectSingle(data, index) {
        let key = [];
        this.disableButton = true;
        if (data.temp === '10th') {
            key = ['tenth_marks', 'is_tenth_percentage'];
        } else if (data.temp === '12th') {
            key = ['twelfth_marks', 'is_twelfth_percentage'];
        } else if (data.temp === 'Diploma') {
            key = ['diploma_marks', 'is_diploma_percentage'];
        } else if (data.temp === 'UG') {
            key = ['ug_marks', 'is_ug_percentage'];
        } else if (data.temp === 'PG') {
            key = ['pg_marks', 'is_pg_percentage'];
        } else if (data.temp === 'Current Backlogs') {
            key = ['current_backlogs'];
        } else if (data.temp === 'Interested for Placement') {
            key = ['interested_for_placement'];
        } else {
            key = ['backlog_history'];
        }
        const payload = {
            user_id: JSON.stringify([this.selectedSId]),
            decision: 'reject_changes',
            keys: key,
        };
        this.call12 = this.UsersService.approveReject(payload).subscribe((res: any) => {
            const resp = res;
            if (resp.success) {
                this.changesList[index].status = 'R';
                this.disableButton = false;
                this.ppaStudentList(undefined);
                this.studentsMsg = [];
                this.studentsMsg.push({
                    severity: 'success',
                    summary: 'Rejected',
                    detail: 'Changes have been rejected',
                });
                setTimeout(() => {
                    this.studentsMsg = [];
                }, 3000);
            }
        });
    }
    rejectChanges() {
        const payload = {
            decision: 'reject_changes',
            user_id: JSON.stringify([this.selectedSId]),
        };
        this.call12 = this.UsersService.approveReject(payload).subscribe((res) => {
            this.showRequestTable = false;
            this.ppaStudentList(undefined);
        });
    }
    openStudentData(data) {
        const payload: any = {};
        payload.user_id = data.id;
        payload.branch_id = data.branch_id[0];
        if (this.purpose === 'Exams App' || (data.status && data.status !== 'Joined')) {
            this.UsersService.getStudentTags_Degree(payload).subscribe((response: any) => {
                const val = response;
                data.tag_detail = val.tag;
                data.degree_in_this_branch = this.degreelist;
                data.department_in_this_branch = this.departmentlist;
                if (this.purpose === 'Exams App') {
                    if (data.email_verified) {
                        this.UsersService.ppaData.next(data);
                        this.studentName = data.name;
                        this.student = data;
                        this.router.navigate(['/student/profile']);
                    } else {
                        if (this.editEmail) {
                            this.editEmailId = true;
                            this.editStudent = data;
                        }
                    }
                } else {
                    if (data.status && data.status === 'Invited') {
                        if (this.editEmail) {
                            this.editEmailId = true;
                            this.editStudent = data;
                        }
                    } else if (data.status && data.status === 'Joined' && this.purpose !== 'Exams App') {
                        if (this.editEmail) {
                            this.editEmailId = true;
                            this.editStudent = data;
                        }
                    } else {
                        this.UsersService.ppaData.next(data);
                        this.studentName = data.name;
                        this.student = data;
                        this.router.navigate(['/student/profile']);
                    }
                }
            });
        } else if ((this.purpose === 'Recruitment' || this.purpose === 'Placement Process App') && data.status && data.status === 'Joined') {
            if (this.editEmail) {
                this.editEmailId = true;
                this.editStudent = data;
            }
        }
    }
    cancelEditEmail() {
        this.editEmailId = false;
        this.tempemail = '';
    }
    editEmailID() {
        if (this.tempemail && this.editEmail && this.userPermission.student_edit) {
            this.loadgenerate = true;
            const email = this.tempemail.trim();
            if (email.toLowerCase().match(this.emailPattern)) {
                this.updateEmailId();
            } else {
                this.showGrowl('error', 'Please enter a valid email id', 'Validation failed');
                this.tempemail = '';
            }
        } else {
            if (!this.tempemail) {
                this.showGrowl('error', 'Please enter the new email id', 'Validation failed');
                this.tempemail = '';
            } else if (!this.editEmail) {
                this.showGrowl('error', 'Edit Email is not subscribed', 'Validation failed');
                this.tempemail = '';
            }
        }
    }
    updateEmailId() {
        this.UsersService.getCaptchaToken('changeemailid').then((token: any) => {
            const payload = {
                old_email_id: this.editStudent.email,
                school_code: this.schoolData.school_code,
                school_id: this.schoolData.school_id,
                gRecognition: token,
                tempemail: this.tempemail,
                purpose: this.userdata.purpose,
                institute_type: this.userdata.institute_type,
                user_role: 'student',
                isAdmin: 'true',
                branch_id: this.editStudent.branch_id,
                department_id: this.editStudent.department_id,
            };
            this.UsersService.changeEmailID(payload).subscribe((response: any) => {
                const data = response;
                this.editEmailId = false;
                this.loadgenerate = false;
                if (data.success) {
                    this.showGrowl(
                        'success',
                        'Email Updated successfully',
                        'Activation link has been sent to updated Email ID. Kindly verify',
                    );
                    this.tempemail = '';
                    return true;
                } else {
                    if (data.message && data.message === 'Email is already requested for another account') {
                        this.confirmationService.confirm({
                            message: 'The email is already requested for another account. <br>Are you sure you want to continue?',
                            header: 'Confirmation',
                            accept: () => {
                                this.updateExistingEmailId(payload);
                            },
                            reject: () => {},
                        });
                        return false;
                    } else {
                        this.showGrowl('error', data.message, 'Validation failed');
                        this.tempemail = '';
                        return false;
                    }
                }
            });
        });
    }

    updateExistingEmailId(payload: any) {
        this.UsersService.changeExistingEmailId(payload).subscribe((response: any) => {
            const data = response;
            if (data.success) {
                this.showGrowl(
                    'success',
                    'Email Updated successfully',
                    'Activation link has been sent to your Email ID. Kindly verify',
                );
                return true;
            } else {
                this.showGrowl('error', data.message, 'Validation failed');
                return false;
            }
        })
    }
    hideButton() {
        if (this.changesList) {
            let val = true;
            const data = _.filter(this.changesList, (change) => {
                return change.status;
            });
            data.length === this.changesList.length ? (val = false) : (val = true);
            return val;
        }
    }
    enrollAllStudents() {
        let payload: any = {
            department: this.departmentId,
            enrolled_status: this.studentEnrollstatus,
            tags: this.studentTags,
            batch: this.studentBatch,
            degree: this.studentDegree,
            targetexam_id: this.studentTargetExam,
            search: this.searchTerm,
            school_id: this.school_id,
            user_role: 'student',
            verification_status: this.studentStatus,
            course_department_id: typeof this.departmentId === 'string' ? [this.departmentId] : this.departmentId,
            course_branch_id: typeof this.branchId === 'string' ? [this.branchId] : this.branchId,
        };
        if (this.filterBranch && this.filterBranch.length) {
            payload.branch_id = this.filterBranch;
        } else {
            payload.all_branches = _.compact(_.map(this.branchList, 'value'));
        }
        if (typeof payload.department_id === 'string') {
            payload.department_id = [payload.department_id];
        }
        payload = _.omitBy(payload, _.isNil);
        this.loadingBtn = true;
        this.courseCreationService.enrollAll(payload).subscribe(
            (res: any) => {
                this.loadingBtn = false;
                if (res.success) {
                    this.studentsMsg = [];
                    const msgtxt = this.institute_type !== 'company' ? ' students' : ' candidates';
                    if (this.checkpath === '/course') {
                        this.studentsMsg.push({
                            severity: 'success',
                            summary: 'Students enrolled',
                            detail: 'Selected' + msgtxt + ' have been enrolled',
                        });
                    } else {
                        this.studentsMsg.push({
                            severity: 'success',
                            summary: 'Students invited',
                            detail: 'Selected' + msgtxt + ' have been invited. Kindly check after sometime.',
                        });
                    }
                    setTimeout(() => {
                        this.studentsMsg = [];
                    }, 3000);
                    this.selectedStudents = [];
                    this.checkedAll = false;
                    this.uncheckAll();
                    this.selectAllFlag = false;
                } else {
                    this.studentsMsg = [];
                    this.studentsMsg.push({
                        severity: 'error',
                        summary: 'Unable to enroll',
                        detail: res.message,
                    });
                    setTimeout(() => {
                        this.studentsMsg = [];
                    }, 3000);
                }
                // setTimeout(() => {
                //   this.studentsMsg = [];
                // }, 3000);
            },
            (error) => {
                this.studentsMsg = [];
                this.studentsMsg.push({
                    severity: 'error',
                    summary: 'Unable to enroll',
                    detail: 'Something went wrong',
                });
                setTimeout(() => {
                    this.studentsMsg = [];
                }, 3000);
            },
        );
    }
    deleteAll() {
        if (this.filterBranch && this.filterBranch.length && this.filterBranch.length === 1) {
            const deleteUser: any = this.userdata.purpose === 'Recruitment' ? 'Candidates' : 'Students ';
            let payload: any = {
                department: this.studentDepartment,
                enrolled_status: this.studentEnrollstatus,
                tags: this.studentTags,
                batch: this.studentBatch,
                degree: this.studentDegree,
                targetexam_id: this.studentTargetExam,
                search: this.searchTerm,
                school_id: this.school_id,
                user_role: 'student',
                verification_status: this.studentStatus,
                purpose: this.userdata.purpose,
            };
            if (this.filterBranch) {
                payload.branch_id = this.filterBranch[0];
            }
            payload = _.omitBy(payload, _.isNil);
            this.globalservice.setDoneState(true);
            this.UsersService.deleteAll(payload).subscribe(
                (response: any) => {
                    this.globalservice.setDoneState(false);
                    if (response && response.severity) {
                        this.purpose === 'Exams App' ? this.listingstudent(undefined) : this.ppaStudentList(undefined);
                        this.studentsMsg = [];
                        this.studentsMsg.push({
                            severity: response.severity,
                            summary: response.summary,
                            detail: response.detail,
                        });
                    } else {
                        this.studentsMsg = [];
                        this.studentsMsg.push({
                            severity: 'error',
                            summary: 'Failed',
                            detail: 'Selected ' + deleteUser + ' Could Not Be Deleted',
                        });
                    }
                    setTimeout(() => {
                        this.studentsMsg = [];
                    }, 3000);
                    this.closeDeleteConfirmation();
                    this.selectedAction = null;
                    this.selectedStudents = [];
                    this.uncheckAll();
                },
                (error) => {
                    this.studentsMsg = [];
                    this.studentsMsg.push({
                        severity: 'error',
                        summary: 'Unable to delete',
                        detail: 'Something went wrong',
                    });
                    this.selectedAction = null;
                    this.selectedStudents = [];
                    this.closeDeleteConfirmation();
                    this.uncheckAll();
                },
            );
        } else {
            this.studentsMsg = [];
            this.studentsMsg.push({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please selet one ' + this.Branch + ' to delete students',
            });
            setTimeout(() => {
                this.studentsMsg = [];
            }, 3000);
        }
    }
    showGrowl(severity, summary, detail) {
        this.studentsMsg = [];
        this.studentsMsg.push({ severity, summary, detail });
    }
    approveRejectAllStudents(decision) {
        if (this.filterBranch && this.filterBranch.length) {
            let filter: any = {
                department: this.studentDepartment,
                enrolled_status: this.studentEnrollstatus,
                tags: this.studentTags,
                batch: this.studentBatch,
                degree: this.studentDegree,
                targetexam_id: this.studentTargetExam,
                search: this.searchTerm,
                school_id: this.school_id,
                user_role: 'student',
                verification_status: this.studentStatus,
                school_code: this.schoolData.school_code,
                isPlacementInterested: this.isPlacementInterested,
            };
            if (this.filterBranch) {
                filter.branch_id = this.filterBranch;
            }
            filter = _.omitBy(filter, _.isNil);
            const payload: any = {
                filter,
                data: { decision },
            };
            if (this.rejectText && this.rejectText.length !== 0) {
                payload.data.reason_for_reject = this.rejectText;
            }
             payload.rejectResonStudentDisplay = this.rejectResonStudentDisplay;
            this.UsersService.approveRejectAll(payload).subscribe(
                (response: any) => {
                    if (response.success) {
                        const decisionVar = decision === 'approve' ? 'approved' : 'rejected';
                        if (response.count[0] === this.studentcount) {
                            this.showGrowl(
                                'success',
                                'Successfully ' + decisionVar,
                                'This process will happen in the background, please check after sometime',
                            );
                        } else if (response.count[0] === 0) {
                            this.showGrowl(
                                'warn',
                                'No students have been ' + decisionVar,
                                'All the selected students are in invited or joined state',
                            );
                        } else {
                            this.showGrowl(
                                'success',
                                'Partially ' + decisionVar,
                                'Some of the students are not ' +
                                    decisionVar +
                                    ' as they are in invited or joined state',
                            );
                        }
                        this.hideReject();
                        this.selectedStudents = [];
                        this.selectedAction = null;
                        this.checkedAll = false;
                        this.selectAllFlag = false;
                        this.ppaStudentList(undefined);
                    } else {
                        this.showGrowl('error', 'Unable to approve', response.message);
                        this.hideReject();
                    }
                },
                (error) => {
                    this.showGrowl('error', 'Unable to approve', 'Something went wrong');
                },
            );
        } else {
            this.showGrowl('warn', 'Warning', 'Please select atleast one ' + this.Branch);
        }
    }
    makeCoordinatorAll() {
        if (this.filterBranch && this.filterBranch.length) {
            let payload: any = {
                department: this.studentDepartment,
                enrolled_status: this.studentEnrollstatus,
                tags: this.studentTags,
                batch: this.studentBatch,
                degree: this.studentDegree,
                targetexam_id: this.studentTargetExam,
                search: this.searchTerm,
                school_id: this.school_id,
                user_role: 'student',
                verification_status: this.studentStatus,
                isPlacementInterested: this.isPlacementInterested,
            };
            if (this.filterBranch) {
                payload.branch_id = this.filterBranch;
            }
            payload = _.omitBy(payload, _.isNil);
            this.UsersService.makeCoordinatorAll(payload).subscribe(
                (response: any) => {
                    if (response.success) {
                        this.showGrowl('success', 'Success', 'All the students have been made as co-ordinators');
                        this.selectAllFlag = false;
                        this.selectedStudents = [];
                        this.checkedAll = false;
                        this.ppaStudentList(undefined);
                    } else {
                        this.showGrowl('error', 'Unable to make selected students as co-ordinator', response.message);
                    }
                },
                (error) => {
                    this.showGrowl('error', 'Unable to make selected students as co-ordinator', 'Something went wrong');
                },
            );
        } else {
            this.showGrowl('warn', 'Warning', 'Please select atleast one ' + this.Branch + ' to make coordinator');
        }
    }
    resestpass() {
        if (this.selectAllFlag) {
            this.UsersService.bulk_resetPassword(this.payloadGenerator()).subscribe(() => {
                this.resetresponse();
            });
        } else {
            const payload = {
                school_id: this.UsersService.getschool_id(),
                user_email: _.map(this.selectedStudents, 'email'),
            };
            this.UsersService.updatepassword(payload).subscribe(() => {
                this.resetresponse();
            });
        }
    }
    resetresponse() {
        this.closeDeleteConfirmation();
        this.studentsMsg = [];
        this.studentsMsg.push({
            severity: 'success',
            summary: 'Successfully password changed.',
            detail: 'Users Passwords has been successfully Changed to Default',
        });
        setTimeout(() => {
            this.studentsMsg = [];
        }, 3000);
        this.purpose === 'Exams App' ? this.listingstudent(undefined) : this.ppaStudentList(undefined);
        this.selectedAction = null;
        this.selectedStudents = [];
    }
    showPageData(event) {
        this.startIndex = event.first;
        this.uncheckAll();
        this.selectedStudents = [];
        this.page = Math.ceil(event.first / this.rowsLimit) + 1;
        this.purpose === 'Exams App' ? this.listingstudent(undefined) : this.ppaStudentList(undefined);
    }
    addApproverName() {
        this.Sharedserviceservice.checkgetCreatorlist().then((staffList: any) => {
            staffList = staffList.result;
            _.forEach(this.studentListData, (each: any) => {
                const approverName = _.find(staffList, { user_id: each.markData.approved_by });
                each.approvedBy = approverName
                    ? approverName.name.split('$')[0] + ' ' + approverName.name.split('$')[1]
                    : ' - ';
            });
        });
    }
    ngDoCheck() {
        if (this.bulkemailids) {
            this.parseEmails(this.bulkemailids);
        }
    }
    bulkenroll() {
        this.OpenenrollDialogBox = true;
    }
    closebulkenroll() {
        this.bulkenrollstatus = false;
        this.OpenenrollDialogBox = false;
        this.emailInvalid = false;
        this.bulkbranch_id = null;
        this.bulkemailids = null;
        this.bulkcourseids = null;
        this.bulkbatch_id = null;
    }
    Cancelenroll() {
        this.OpenenrollDialogBox = false;
        this.bulkenrollstatus = false;
        this.bulkbranch_id = null;
        this.bulkemailids = null;
        this.bulkcourseids = null;
        this.bulkenrollstatus = false;
        this.bulkbatch_id = null;
    }
    Saveenroll() {
        this.bulkcourseids = [this.c_id];
        if (this.institute_type !== 'training_institute' && this.checkpath === '/course' && !this.bulkbatch_id) {
            this.selectMsg = [];
            this.selectMsg.push({ severity: 'error', summary: 'Failed!', detail: 'Select a Batch' });
            return;
        }
        if (
            this.bulkbranch_id &&
            this.bulkemailids &&
            this.emailArray &&
            this.emailArray.length > 0 &&
            this.bulkcourseids &&
            !this.emailInvalid
        ) {
            // this.bulkenrollstatus = true;
            const finalEmail: any = [];
            this.emailArray = _.forEach(this.emailArray, (element) => {
                finalEmail.push(element.trim().toLowerCase());
            });
            const payload: any = {
                branch_id: this.bulkbranch_id,
                email_ids: finalEmail,
                c_ids: this.bulkcourseids,
                school_code: this.schoolData.school_code,
            };
            if (this.bulkbatch_id && this.institute_type !== 'training_institute' && this.checkpath === '/course') {
                payload.batch_id = this.bulkbatch_id;
            }
            this.courseCreationService.bulkenroll(payload).subscribe((response: any) => {
                const r_data = response;
                if (r_data.success) {
                    this.bulkEnrollData.branch_name = _.find(
                        this.branchlist,
                        (br) => br.value === this.bulkbranch_id,
                    ).label;
                    this.bulkenrollstatus = true;
                    this.bulkEnrollData.enrolledStudents = r_data.Enroll_students;
                    this.bulkEnrollData.notExists = _.map(r_data.user_not_exists, (val) => {
                        return { email: val };
                    });
                    this.bulkEnrollData.enrolledStudents = _.map(r_data.Enroll_students, (val) => {
                        return { email: val };
                    });
                    this.bulkEnrollData.notInBranch = _.map(r_data.user_not_in_branchEmailids, (val) => {
                        return { email: val };
                    });
                }
            });
        } else {
            this.selectMsg = [];
            this.selectMsg.push({ severity: 'error', summary: 'Failed!', detail: 'Enter All Required Fields' });
        }
    }
    Closeenroll() {
        this.bulkenrollstatus = false;
        this.bulkbranch_id = null;
        this.bulkemailids = null;
        this.bulkcourseids = null;
        this.bulkbatch_id = null;
    }
    parseEmails(emails: string) {
        if (emails) {
            this.emailArray = emails.split('\n');
        }
        this.emailArray = _.filter(this.emailArray, function (email) {
            return email !== '';
        });
        for (const e of this.emailArray) {
            if (!this.validateEmail(e)) {
                this.emailInvalid = true;
                return false;
            }
        }
        this.emailInvalid = false;
        return true;
    }
    validateEmail(email) {
        email = email.trim();
        if (email.toLowerCase().match(this.emailPattern)) {
            return true;
        }
        return false;
    }
    // download student list
    ppaFormatList() {
   
        return new Promise(async (resolve) => {
            this.FulldownloadData = [];
            this.filterData = [];
            this.checkedAll = false;
            this.emptyMessage = 'Loading...';
            this.alreadySelectedBatch = this.studentBatch;
            this.alreadySelectedTarget = this.studentTargetexam;
            const payload: any = {
                page: 1,
                page_limit: 5000,
                department: this.studentDepartment,
                targetexam_id: this.studentTargetexam,
                 enrolled_status: this.studentEnrollstatus,
                tags: this.studentTags,                
                batch: this.studentBatch,
                degree: this.studentDegree,
                school_id: this.school_id,
                search: this.searchTerm,
                user_role: 'student',
                isPortalAccess: this.isShowInactive,
                isDrivePortalAccess: this.isDriveInactive,
                isPlacementInterested: this.isPlacementInterested,
                purpose: this.purpose,
                all_branches: _.compact(_.map(this.branchList, 'value')),
                ifinmainDepartment: _.find(this.departmentlist, (each: any) => {
                    return each.label.includes('admin');
                })
                    ? true
                    : false,
            };
           if(this.purpose === 'Exams App')
            {                payload.userstatus = this.studentStatus;
                
                }
            else
            {
               
                payload.verification_status = this.studentStatus;
                
            }
           
                    if (this.checkpath === '/course') {
                if (this.filterBranch && this.filterBranch.length) {
                    payload.branch_id = this.filterBranch;
                } else {
                    payload.all_branches = this.branchId;
                    payload.all_batches = this.batchIds && this.batchIds.length ? this.batchIds : [];
                    this.selectMsg = [];
                    this.selectMsg.push({
                        severity: 'warn',
                        summary: 'Warning!',
                        detail: 'Please select one ' + this.Branch,
                    });
                    this.emptyMessage = 'No records found';
                    return;
                }
            } else {
                payload.branch_id = this.filterBranch;
            }
            if (this.sortby) {
                payload.sort_by = this.sortby;
                if (this.sortOrder) {
                    payload.sort_order = 'ASC';
                } else {
                    payload.sort_order = 'DESC';
                }
            }
                payload.verification_status = this.studentStatus;
                let j=0; 
                for (let i=1; i<=this.studentcount; i=i+5000) {
                j++;
                    payload.page = j;
                
                await this.getStdListDownload(payload);                
            }
            resolve(true);
        });
    }
    getStdListDownload(payload): Promise<any> {
        return new Promise(async (resolved, rejected) => {
            this.SettingsService.getStudentlist(payload).subscribe((response: any) => {
                const SL = response;
                if (this.studentEnrollstatus === false && this.studentEnrollstatus !== null) {
                    SL.data.data = _.filter(SL.data.data, (enstatus) => {
                        return !enstatus.course_students;
                    });
                }
                if (this.purpose === 'Exams App') {
                    _.forEach(SL.data.data, (o: any) => {
                        if (o.email_verified) {
                            status = 'Joined';
                        } else {
                            status = 'Invited';
                        }
                        let degree;
                        let targetexam;
                        let degree_id;
                        let target_id;
                        switch (this.institute_type) {
                            case 'college':
                                if (o.school_branch_department_users.school_degrees) {
                                    degree = o.school_branch_department_users.school_degrees.degree;
                                    degree_id = o.school_branch_department_users.school_degrees.degree_id;
                                } else {
                                    degree = '-';
                                }
                                break;
                            case 'training_institute':
                                this.isBranch = false;
                                this.isbadge1 = false;
                                this.isSuperBadge = false;
                                this.isInterestedPlacement = false;
                                if (o.school_branch_department_users.school_targetexam) {
                                    targetexam = o.school_branch_department_users.school_targetexam.targetexam_name;
                                    target_id = o.school_branch_department_users.school_targetexam.targetexam_id;
                                } else {
                                    targetexam = '-';
                                }
                                break;
                        }
                        const eachStudent: any = {
                            roll_no: o.roll_no ? o.roll_no : '-',
                            email_verified: o.email_verified,
                            gender: o.gender,
                            badge: o.badge,
                            superbadge: o.superbadge,
                            name: '- ',
                            email: o.email ? o.email : '-',
                            phoneno: o.phone ? o.phone : '-',
                            profile_pic: o.profile_pic,
                            isDeletable: o.isDeletable,
                            dob: o.dob ? o.dob.substring(0, 10) : '-',
                            branch: [],
                            branch_id: [],
                            batch: [],
                            batch_id: [],
                            degree: [],
                            degree_id: [],
                            target_id: [],
                            targetexam: [],
                            department: [],
                            department_id: [],
                            role: o.school_branch_department_users.user_role
                                ? o.school_branch_department_users.user_role
                                : '-',
                            status: status ? status : '-',
                            id: o.user_id ? o.user_id : '-',
                            portal_access_status: o.portal_access_status ? 'Disabled' : 'Enabled',
                            verified_pic: o.verified_pic ? o.verified_pic : undefined,
                            application_no: o.application_no ? o.application_no : '',
                            disable_Reason: o.portal_access_status && o.portal_access_status.disable_Reason ? o.portal_access_status.disable_Reason : '',
                            Courses: o.courseCount && o.courseCount>0 ? _.join(o.coursenames, ', ') : '-',
                        
                            placed_count: o.driveCount ? o.driveCount : '-',
                        };
                        
                        if (this.downloadCSVAction && this.isStudentNameSplit) {
                            if (o.name) {
                                const name = o.name.split('$');
                                eachStudent.f_name = name && name.length && name.length === 2 ? name[0] : '-';
                                eachStudent.l_name = name && name.length && name.length === 2 ? name[1] : '-';
                            } else {
                                eachStudent.f_name = '-';
                                eachStudent.l_name = '-';
                            }
                        } else {
                            eachStudent.name = o.name ? o.name.split('$')[0] + ' ' + o.name.split('$')[1] : '- ';
                        }
                        if (o.school_branch_department_users && o.school_branch_department_users.length) {
                            eachStudent.branch_id = _.map(o.school_branch_department_users, 'branch_id');
                            eachStudent.department_id = _.map(o.school_branch_department_users, 'department_id');
                            eachStudent.batch_id = _.map(o.school_branch_department_users, 'batch');
                            eachStudent.degree_id = _.map(o.school_branch_department_users, 'degree_id');
                            eachStudent.target_id = _.map(o.school_branch_department_users, 'targetexam_id');
                            eachStudent.branch = _.map(o.school_branch_department_users, 'school_branches.branch_name');
                            eachStudent.branch = _.join(eachStudent.branch, ', ');
                            eachStudent.department = _.map(
                                o.school_branch_department_users,
                                'school_branch_department.department_name',
                            );
                            eachStudent.department = _.join(eachStudent.department, ', ');
                            if (o.school_branch_department_users[0].school_batches) {
                                eachStudent.batch = _.map(o.school_branch_department_users, 'school_batches.batch');
                                eachStudent.batch = _.join(eachStudent.batch, ', ');
                            } else {
                                eachStudent.batch = '';
                            }
                            if (o.school_branch_department_users[0].school_degrees) {
                                eachStudent.degree = _.map(o.school_branch_department_users, 'school_degrees.degree');
                                eachStudent.degree = _.join(eachStudent.degree, ', ');
                            } else {
                                eachStudent.degree = '';
                            }
                            if (o.school_branch_department_users[0].school_targetexam) {
                                eachStudent.targetexam = _.map(
                                    o.school_branch_department_users,
                                    'school_targetexam.targetexam_name',
                                );
                                eachStudent.targetexam = _.join(eachStudent.targetexam, ', ');
                            } else {
                                eachStudent.targetexam = '';
                            }
                            if (o.users_has_tags && o.users_has_tags.length > 0) {
                                eachStudent.tag_detail = o.users_has_tags;
                            }
                            if (
                                o.student_custom_fields &&
                                o.student_custom_fields.length &&
                                this.filterBranch.length &&
                                this.filterBranch[0]
                            ) {
                                const Branchfields: any = o.student_custom_fields.find((each: any) => {
                                    return each.branch_id === this.filterBranch[0];
                                });
                                if (Branchfields && Branchfields.fields && Branchfields.fields.length) {
                                    eachStudent.student_custom_fields = Branchfields.fields;
                                }
                            }
                        }
                        if (o && o.student_custom_fields && o.student_custom_fields.length) {
                            _.forEach(o.student_custom_fields[0].fields, (obj: any) => {
                                if (obj && obj.type === 'resume' && obj.answer) {
                                    eachStudent.verified_resume = 'Yes';
                                }
                            });
                            if (!eachStudent.verified_resume) {
                                eachStudent.verified_resume = 'No';
                            }
                        }
                        else {
                            eachStudent.verified_resume = 'No';
                        }
                        this.FulldownloadData.push(eachStudent);
                    });
                } else {
                    _.forEach(SL.data.data, (o: any) => {
                        if (o.student_ppa_profiles && o.student_ppa_profiles.verification_status === 1) {
                            o.status = 'Joined';
                        } else if (o.student_ppa_profiles && o.student_ppa_profiles.verification_status === 2) {
                            if (this.purpose === 'Recruitment') {
                                o.status = 'Approved';
                            } else {
                                o.status = 'Published';
                            }
                        } else if (o.student_ppa_profiles && o.student_ppa_profiles.verification_status === 3) {
                            o.status = 'Approved';
                        } else if (o.student_ppa_profiles && o.student_ppa_profiles.verification_status === 0) {
                            o.status = 'Invited';
                        } else {
                            if (this.purpose === 'Recruitment') {
                                o.status = 'Joined';
                            } else {
                                o.status = 'Rejected';
                            }
                        }
                        const ppa: any = o.student_ppa_profiles;
                        const eachStudent: any = {
                            roll_no:
                            o.student_ppa_profiles && o.student_ppa_profiles.roll_no ? o.student_ppa_profiles.roll_no : '-',    
                            reject_reason:
                            o.status === 'Rejected' && o.student_ppa_profiles && o.student_ppa_profiles.reject_reason ? o.student_ppa_profiles.reject_reason.reason_for_reject : '-', 
                            approvedBy:
                            ppa && ppa.history !== null
                            ? ppa.history[ppa.history.length - 1].approved_by
                                ? this.getName(ppa.history[ppa.history.length - 1].approved_by)
                                : null
                            : null,
                            rejectedBy:
                            ppa && ppa.history !== null
                            ? ppa.history[ppa.history.length - 1].rejectedBy
                                ? this.getName(ppa.history[ppa.history.length - 1].rejectedBy)
                                : null
                            : null,
                            approvedAt:
                            ppa && ppa.history !== null
                            ? ppa.history[ppa.history.length - 1].approvedAt
                                ? this.datePipe.transform(
                                      new Date(ppa.history[ppa.history.length - 1].approvedAt),
                                      'dd/MM/yy HH:mm',
                                  )
                                : null
                            : null,
                            rejectedAt:
                            ppa && ppa.history !== null
                            ? ppa.history[ppa.history.length - 1].rejectedAt
                                ? this.datePipe.transform(
                                      new Date(ppa.history[ppa.history.length - 1].rejectedAt),
                                      'dd/MM/yy HH:mm',
                                  )
                                : null
                            : null,
                            name: o.name ? o.name.split('$')[0] + ' ' + o.name.split('$')[1] : '- ',
                            email: o.email ? o.email : '-',
                            phoneno: o.phone ? o.phone : '-',
                            badge: o.badge,
                            superbadge: o.superbadge,
                            profile_pic: o.profile_pic,
                            dob: o.dob ? o.dob.substring(0, 10) : '-',
                            branch: [],
                            branch_id: [],
                            batch: [],
                            batch_id: [],
                            degree: [],
                            degree_id: [],
                            targetexam: [],
                            target_id: [],
                            department: [],
                            department_id: [],
                            role: '-',
                            id: o.user_id,
                            isDeletable: o.isDeletable,
                            status: o.status,
                            gender: o.gender,
                            coordinator:
                                o.school_branch_department_users && o.school_branch_department_users.length > 0
                                    ? o.school_branch_department_users[0].special_permission * 1
                                    : 0,
                            markData: o.student_ppa_profiles,
                            changesPresent: o.student_ppa_profiles && o.student_ppa_profiles.recent_change,
                            changes:
                            o.student_ppa_profiles &&
                            o.student_ppa_profiles.recent_change &&
                            o.student_ppa_profiles.recent_change.changes &&
                            Object.keys(o.student_ppa_profiles.recent_change.changes).length
                                ? true
                                : false,
                            tenth:
                            o.student_ppa_profiles &&
                            o.student_ppa_profiles.tenth_marks !== null &&
                            (o.student_ppa_profiles.tenth_marks || o.student_ppa_profiles.tenth_marks === 0)
                                ? o.student_ppa_profiles.tenth_marks
                                : 'Not Applicable',
                            is_tenth_percentage: 
                            o.student_ppa_profiles &&
                            o.student_ppa_profiles.tenth_marks !== null &&
                            (o.student_ppa_profiles.tenth_marks || o.student_ppa_profiles.tenth_marks === 0)
                                ? o.student_ppa_profiles.is_tenth_percentage
                                : 'Not Applicable',
                            twelfth:
                            o.student_ppa_profiles &&
                            o.student_ppa_profiles.twelfth_marks !== null &&
                            (o.student_ppa_profiles.twelfth_marks || o.student_ppa_profiles.twelfth_marks === 0)
                                ? o.student_ppa_profiles.twelfth_marks
                                : 'Not Applicable',
                            is_twelfth_percentage: 
                            o.student_ppa_profiles &&
                            o.student_ppa_profiles.twelfth_marks !== null &&
                            (o.student_ppa_profiles.twelfth_marks || o.student_ppa_profiles.twelfth_marks === 0)
                                ? o.student_ppa_profiles.is_twelfth_percentage
                                : 'Not Applicable',
                            diploma:
                            o.student_ppa_profiles &&
                            o.student_ppa_profiles.diploma_marks !== null &&
                            (o.student_ppa_profiles.diploma_marks || o.student_ppa_profiles.diploma_marks === 0)
                                ? o.student_ppa_profiles.diploma_marks
                                : 'Not Applicable',
                            is_diploma_percentage: 
                            o.student_ppa_profiles &&
                            o.student_ppa_profiles.diploma_marks !== null &&
                            (o.student_ppa_profiles.diploma_marks || o.student_ppa_profiles.diploma_marks === 0)
                                ? o.student_ppa_profiles.is_diploma_percentage
                                : 'Not Applicable',
                            ug:
                            o.student_ppa_profiles &&
                            o.student_ppa_profiles.ug_marks !== null &&
                            (o.student_ppa_profiles.ug_marks || o.student_ppa_profiles.ug_marks === 0)
                                ? o.student_ppa_profiles.ug_marks
                                : 'Not Applicable',
                            is_ug_percentage:   o.student_ppa_profiles &&
                            o.student_ppa_profiles.ug_marks !== null &&
                            (o.student_ppa_profiles.ug_marks || o.student_ppa_profiles.ug_marks === 0)
                                ? o.student_ppa_profiles.is_ug_percentage
                                : null,
                            pg:
                            o.student_ppa_profiles &&
                            o.student_ppa_profiles.pg_marks !== null &&
                            (o.student_ppa_profiles.pg_marks || o.student_ppa_profiles.pg_marks === 0)
                                ? o.student_ppa_profiles.pg_marks
                                : 'Not Applicable',
                            is_pg_percentage:  o.student_ppa_profiles &&
                            o.student_ppa_profiles.pg_marks !== null &&
                            (o.student_ppa_profiles.pg_marks || o.student_ppa_profiles.pg_marks === 0)
                                ? o.student_ppa_profiles.is_pg_percentage
                                : null,
                            currentBack:
                            o.student_ppa_profiles &&
                            o.student_ppa_profiles.current_backlogs !== null &&
                            (o.student_ppa_profiles.current_backlogs || o.student_ppa_profiles.current_backlogs === 0)
                                ? o.student_ppa_profiles.current_backlogs
                                : 'Not Applicable',
                            backlog:
                            o.student_ppa_profiles && o.student_ppa_profiles.backlog_history
                            ? o.student_ppa_profiles.backlog_history
                                ? 'Yes'
                                : 'Not Applicable'
                            : o.student_ppa_profiles && o.student_ppa_profiles.backlog_history === false
                            ? 'No'
                            : 'Not Applicable',
                            interested:
                            o.student_ppa_profiles && o.student_ppa_profiles.interested_for_placement
                            ? o.student_ppa_profiles.interested_for_placement
                                ? 'Yes'
                                : 'Not Applicable'
                            : o.student_ppa_profiles && o.student_ppa_profiles.interested_for_placement === false
                            ? 'No'
                            : 'Not Applicable',
                            portal_access_status: o.portal_access_status ? 'Disabled' : 'Enabled',
                            disable_Reason: o.portal_access_status && o.portal_access_status.disable_Reason ? o.portal_access_status.disable_Reason : '',
                            Courses: o.courseCount && o.courseCount>0 ? _.join(o.coursenames, ', ') : '-',
                            verified_pic: o.verified_pic ? o.verified_pic : undefined,
                            application_no: o.application_no ? o.application_no : '',
                            placed_count: o.driveCount ? o.driveCount : '-',
                        };
                        if (this.downloadCSVAction && this.isStudentNameSplit) {
                            if (o.name) {
                                const name = o.name.split('$');
                                eachStudent.f_name = name && name.length && name.length === 2 ? name[0] : '-';
                                eachStudent.l_name = name && name.length && name.length === 2 ? name[1] : '-';
                            } else {
                                eachStudent.f_name = '-';
                                eachStudent.l_name = '-';
                            }
                        } else {
                            eachStudent.name = o.name ? o.name.split('$')[0] + ' ' + o.name.split('$')[1] : '- ';
                        }
                        if (o.school_branch_department_users && o.school_branch_department_users.length) {
                            eachStudent.branch_id = _.map(o.school_branch_department_users, 'branch_id');
                            eachStudent.department_id = _.map(o.school_branch_department_users, 'department_id');
                            eachStudent.batch_id = _.map(o.school_branch_department_users, 'batch');
                            eachStudent.degree_id = _.map(o.school_branch_department_users, 'degree_id');
                            eachStudent.target_id = _.map(o.school_branch_department_users, 'targetexam_id');
                            eachStudent.branch = _.map(o.school_branch_department_users, 'school_branches.branch_name');
                            eachStudent.branch = _.join(eachStudent.branch, ', ');
                            eachStudent.department = _.map(
                                o.school_branch_department_users,
                                'school_branch_department.department_name',
                            );
                            eachStudent.department = _.join(eachStudent.department, ', ');
                            if (o.school_branch_department_users[0].school_batches) {
                                eachStudent.batch = _.map(o.school_branch_department_users, 'school_batches.batch');
                                eachStudent.batch = _.join(eachStudent.batch, ', ');
                            } else {
                                eachStudent.batch = '';
                            }
                            if (o.school_branch_department_users[0].school_degrees) {
                                eachStudent.degree = _.map(o.school_branch_department_users, 'school_degrees.degree');
                                eachStudent.degree = _.join(eachStudent.degree, ', ');
                            } else {
                                eachStudent.degree = '';
                            }
                            if (o.school_branch_department_users[0].school_targetexam) {
                                eachStudent.targetexam = _.map(
                                    o.school_branch_department_users,
                                    'school_targetexam.targetexam_name',
                                );
                                eachStudent.targetexam = _.join(eachStudent.targetexam, ', ');
                            } else {
                                eachStudent.targetexam = '';
                            }
                        }
                        if (o.users_has_tags && o.users_has_tags.length > 0) {
                            eachStudent.tag_detail = o.users_has_tags;
                        }
                        if (
                            o.student_custom_fields &&
                            o.student_custom_fields.length &&
                            typeof o.student_custom_fields !== 'string' &&
                            this.filterBranch.length &&
                            this.filterBranch[0]
                        ) {
                            for (let eachBranch of this.filterBranch) {
                                const Branchfields: any = o.student_custom_fields.find((each: any) => {
                                    return each.branch_id === eachBranch;
                                });
                                if (Branchfields && Branchfields.fields) {
                                    eachStudent.student_custom_fields = Branchfields.fields;
                                }
                            }
                        }
                        if (o && o.student_custom_fields && o.student_custom_fields.length) {
                            _.forEach(o.student_custom_fields[0].fields, (obj: any) => {
                                if (obj && obj.type === 'resume' && obj.answer) {
                                    eachStudent.verified_resume = 'Yes';
                                }
                            });
                            if (!eachStudent.verified_resume) {
                                eachStudent.verified_resume = 'No';
                            }
                        }
                        else {
                            eachStudent.verified_resume = 'No';
                        }
                        this.FulldownloadData.push(eachStudent);
                    });
                }
                this.downloadCSVAction = false;
                resolved(true);
            });
        });
    }
    async downloadStudentListCsv() {
        this.customFields = [];
        if (this.filterBranch && this.filterBranch.length) {
            if (
                (this.institute_type === 'training_institute' &&
                    this.studentTargetexam &&
                    this.studentTargetexam.length) ||
                ((this.institute_type === 'college' || this.institute_type === 'company') &&
                    this.studentBatch &&
                    this.studentBatch.length)
            ) {
                this.showDownload = true;
                this.emptyMessage = 'Loading...';
                this.studentCount = this.studentcount;

                this.alreadySelectedBatch = this.studentBatch;
                for (let eachBranch of this.filterBranch) {
                    await this.schoolService.getBranchwiseSchoolCustomFields(eachBranch, this.school_id)
                        .subscribe((response: any) => {
                            const branchName = this.branchList.find((one: any) => {
                                return one.value === eachBranch;
                            })
                            if (
                                response &&
                                response.studentCustomFields &&
                                response.studentCustomFields.student_custom_fields
                            ) {
                                response = response.studentCustomFields.student_custom_fields.fields;
                                if (response) {
                                    for (const data of response) {
                                        if (!data.archive) {
                                            if (
                                                data.type === 'radiobutton' ||
                                                data.type === 'checkbox' ||
                                                data.type === 'dropdown'
                                            ) {
                                                let obj: any = {};
                                                if (branchName) {
                                                    obj = {
                                                        type: data.type,
                                                        label: branchName.label + ' - ' + data.question,
                                                        value: _.map(data.option, 'value'),
                                                        cf_id: data.cf_id,
                                                        selected: false,
                                                    };
                                                } else {
                                                    obj = {
                                                        type: data.type,
                                                        label: data.question,
                                                        value: _.map(data.option, 'value'),
                                                        cf_id: data.cf_id,
                                                        selected: false,
                                                    };
                                                }
                                                this.customFields.push(obj);
                                            } else if (data.type === 'shortanswer' || data.type === 'longanswer') {
                                                let obj: any = {};
                                                if (branchName) {
                                                    obj = {
                                                        type: data.type,
                                                        label: branchName.label + ' - ' + data.question,
                                                        cf_id: data.cf_id,
                                                        selected: false,
                                                    };
                                                } else {
                                                    obj = {
                                                        type: data.type,
                                                        label: data.question,
                                                        cf_id: data.cf_id,
                                                        selected: false,
                                                    };
                                                }
                                                this.customFields.push(obj);
                                            }
                                        }
                                    }
                                }
                            }
                        });
                }
            } else {
                this.showGrowl(
                    'warn',
                    'Alert',
                    'Please select atleast one ' +
                    (this.institute_type === 'training_institute' ? 'Target Exam' : 'Batch') +
                    ' to download the student list',
                );
            }
        } else {
            if (this.filterBranch && this.filterBranch.length) {
                this.showGrowl(
                    'warn',
                    'Alert',
                    'Please select only one ' + this.Branch + ' to download the student list',
                );
            } else {
                this.showGrowl('warn', 'Alert', 'Please select a ' + this.Branch + ' to download the student list');
            }
        }
    }
    getUsers() {
        this.Sharedserviceservice.checkgetCreatorlist().then((response) => {
            this.createdBy = [];
            let fillarray;
            fillarray = response.result;
            for (const u of fillarray) {
                if (u.name) {
                    if (_.includes(u.name, '$')) {
                        u.name = u.name.replace('$', ' ');
                        this.createdBy.push({ label: u.name, value: u.user_id });
                    } else {
                        this.createdBy.push({ label: u.name, value: u.user_id });
                    }
                }
            }
        });
    }
    getName(creator_user_uid) {
        const name: any = _.find(this.createdBy, (o: any) => {
            return o.value === creator_user_uid;
        });
        return name ? name.label : null;
    }
    bulkEditStudent() {
        if (
            this.filterBranch &&
            this.filterBranch.length === 1 &&
            ((this.institute_type === 'training_institute' &&
                this.studentTargetexam &&
                this.studentTargetexam.length === 1) ||
                ((this.institute_type === 'college' || this.institute_type === 'company') &&
                    this.studentBatch &&
                    this.studentBatch.length === 1))
        ) {
            this.editModalDisplay = true;
        } else {
            this.selectMsg = [];
            this.selectMsg.push({
                severity: 'warn',
                summary: 'Warning',
                detail:
                    'Please select one ' +
                    this.Branch +
                    ' and ' +
                    (this.institute_type === 'training_institute' ? 'Target Exam' : 'Batch'),
            });
        }
    }
    closeBulkEdit() {
        this.editModalDisplay = false;
        this.selectedAction = null;
        this.tagslist = null;
        this.stdUpdateBatch = null;
    }
    afterBulkEdit() {
        this.studentDepartment = null;
        this.studentEnrollstatus = null;
        this.studentDegree = null;
        this.studentStatus = null;
        this.studentTags = null;
        this.tagslist = null;
        this.getAllTags();
        this.appliedCount = 0;
        this.purpose === 'Exams App' ? this.listingstudent(undefined) : this.ppaStudentList(undefined);
    }
    bulkEditSubmit(_ids, _tags) {
        if (this.filterBranch && this.filterBranch.length && this.filterBranch.length === 1) {
            const payload: any = {};
            if (_tags) {
                payload.tags = _tags;
            }
            if (_ids) {
                payload.degree_id = _ids;
            }
            if (!_ids && !(_tags && _tags.length > 0) && !this.stdUpdateBatch && !this.stdUpdateDepartment) {
                this.closeBulkEdit();
                this.editModalDisplay = false;
                this.selectMsg = [];
                this.selectMsg.push({
                    severity: 'warn',
                    summary: 'Validation Failed',
                    detail: 'Enter atleast any one value !',
                });
            } else {
                Object.keys(payload).forEach((key) => payload[key] == null && delete payload[key]);
                payload.user_role = 'student';
                if (this.filterBranch) {
                    payload.branch_id = this.filterBranch[0];
                } else {
                    payload.all_branches = _.compact(_.map(this.branchList, 'value'));
                }
                if (this.selectAllFlag) {
                    this.selectedStudents = [];
                    payload.school_code = this.schoolData.school_code;
                    payload.school_id = this.school_id;
                    payload.department = this.studentDepartment ? this.studentDepartment : '';
                    payload.batch = this.studentBatch && this.studentBatch.length === 1 ? this.studentBatch[0] : '';
                    payload.degree = this.studentDegree ? this.studentDegree : '';
                    payload.search = this.searchTerm;
                    payload.user_id = [this.user_id];
                    payload.targetexam_id =
                        this.studentTargetexam && this.studentTargetexam.length === 1 ? this.studentTargetexam[0] : '';
                    if (this.studentEnrollstatus !== null) {
                        payload.enrolled_status = this.studentEnrollstatus;
                    }
                    if (this.studentStatus !== null) {
                        payload.verification_status = this.studentStatus;
                    }
                    payload.update_batch_id = this.stdUpdateBatch ? this.stdUpdateBatch : '';
                    payload.old_batch_id =
                        this.studentBatch && this.studentBatch.length === 1 ? this.studentBatch[0] : '';
                    payload.isPlacementInterested = this.isPlacementInterested;
                    payload.department_id = this.stdUpdateDepartment ? this.stdUpdateDepartment : '';
                    if (this.purpose !== 'Exams App') {
                        this.selectMsg = [];
                        this.selectMsg.push({
                            severity: 'success',
                            summary: 'Notice',
                            detail: "Batch will be updated for student's who are not eligible in any drive",
                        });
                        setTimeout(() => {
                            this.sendResponse(true);
                        }, 3000);
                    } else {
                        this.sendResponse(true);
                    }
                    this.UsersService.bulkEdit_selectallStudent(payload).subscribe(
                        (response: any) => {
                            if (!response.success) {
                                this.sendResponse(false);
                            }
                        },
                        (error) => {
                            this.sendResponse(false);
                        },
                    );
                } else {
                    const userData: any = [];
                    this.selectedStudents.forEach((each: any) => {
                        userData.push({
                            user_id: each.id,
                            s_profile_id:
                                each.markData && each.markData.s_profile_id ? each.markData.s_profile_id : null,
                        });
                    });
                    payload.user_id = userData;
                    if (this.filterBranch && this.filterBranch.length && this.stdUpdateBatch) {
                        payload.batch_id = this.stdUpdateBatch;
                        payload.old_batch_id =
                            this.studentBatch && this.studentBatch.length === 1 ? this.studentBatch[0] : '';
                    }
                    if (this.stdUpdateDepartment) {
                        payload.department_id = this.stdUpdateDepartment;
                        this.stdUpdateDepartment = "";
                    }
                    this.UsersService.bulk_editStudent(payload).subscribe(
                        (res: any) => {
                            if (res.success) {
                                if ((this.filterBranch && this.filterBranch.length && this.stdUpdateBatch) || this.stdUpdateDepartment) {
                                    if (this.purpose !== 'Exams App') {
                                        this.selectMsg = [];
                                        this.selectMsg.push({
                                            severity: 'success',
                                            summary: 'Notice',
                                            detail:
                                                "Batch will be updated for student's who are not eligible in any drive",
                                        });
                                        setTimeout(() => {
                                            this.sendResponse(true);
                                        }, 3000);
                                    } else {
                                        this.sendResponse(true);
                                    }
                                } else {
                                    this.sendResponse(true);
                                }
                            } else {
                                this.sendResponse(false);
                            }
                        },
                        (error) => {
                            this.sendResponse(false);
                        },
                    );
                }
            }
        } else {
            this.closeBulkEdit();
            this.selectMsg = [];
            this.selectMsg.push({
                severity: 'warn',
                summary: 'Warning',
                detail:
                    'Please select one ' +
                    this.Branch +
                    ' and ' +
                    (this.institute_type === 'training_institute' ? 'Target Exam' : 'Branch'),
            });
        }
    }
    sendResponse(value) {
        if (value) {
            this.closeBulkEdit();
            this.afterBulkEdit();
            this.selectMsg = [];
            this.selectMsg.push({
                severity: 'success',
                summary: 'Updated Successfully',
                detail: 'Update will happen in the background! Please check after sometime',
            });
        } else {
            this.closeBulkEdit();
            this.selectMsg = [];
            this.selectMsg.push({ severity: 'error', summary: 'Updated Failed', detail: 'Something went Wrong !' });
        }
    }
    onSelect(event) {
        this.pushImage = [];
        for (const file of event.files) {
            this.pushImage.push({
                source: URL.createObjectURL(file),
                file: file,
                type: file.type,
                data: 'input',
                size: (file.size / 1024).toFixed(2),
            });
        }
    }
    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    clearPushImage() {
        if (this.pushImage.length > 0 && this.uploadFile) {
            this.uploadFile.clear();
            this.pushImage = [];
        }
    }
    uploadPushImageS3(): Promise<any> {
        return new Promise((resolveedf, resolvese) => {
            if (this.pushImage && this.pushImage.length) {
                const blobData = this.pushImage[0].file;
                const original_name: any = this.pushImage[0].file.name;
                const pay = {
                    file_name:
                        'pushImages/' +
                        this.schoolData.school_code +
                        '/' +
                        new Date().getTime().toString() +
                        '-img' +
                        '/' +
                        original_name,
                    type: this.pushImage[0].type,
                };
                // let blobData = this.dataURItoBlob(this.uploadedFiles[0].file);
                this.UploadFileService.getSignedUrl(pay).subscribe((url: any) => {
                    if (url) {
                        const json = url;
                        this.UploadFileService.uploadUsingSignedUrl(json.data.url, blobData).subscribe((r: any) => {
                            if (r && r.status === 200) {
                                const bucket: string = r.url.split('.amazonaws')[0].split('://')[1].split('.')[0];
                                const s3_url = 'https://s3.amazonaws.com/' + bucket + '/' + pay.file_name;
                                resolveedf(s3_url);
                            }
                        });
                    }
                });
            } else {
                resolveedf(false);
            }
        });
    }
    hideBadgeDialog() {
        this.badgedialog = false;
        this.addBulkBadgesDialog = false;
        this.selectedAction = '';
        this.selectedStudents = [];
    }
    getbadges(carValue, event) {
        event.stopPropagation();
        this.currentBadge = carValue.badge;
        this.currentSuperbadge = carValue.superbadge;
        this.currentStudentValue = carValue;
        this.blocked = true;
        this.globalservice.setDoneState(true);
        const payload: any = {
            user_id: carValue.id,
            school_id: this.school_id,
        };
        this.UsersService.getbadges(payload).subscribe((res: any) => {
            const resp = res;
            this.blocked = false;
            this.globalservice.setDoneState(false);
            if (resp.success) {
                this.badgedialog = true;
                this.currentBadge = res.badge;
                this.currentSuperbadge = res.superbadge;
                this.earnedlist = resp.mannualList;
                this.penalizedList = resp.drivePenalize;
                _.forEach(this.earnedlist, (eachOne: any) => {
                    if (eachOne.staff) {
                        eachOne.staff = this.getName(eachOne.staff);
                    }
                    if (eachOne.date) {
                        eachOne.date = this.datePipe.transform(new Date(eachOne.date), 'MMM dd,yyyy h:mm a');
                    }
                });
                resp.earnedlist.forEach((eachOne: any) => {
                    if (eachOne.submit_time) {
                        eachOne.submit_time = this.datePipe.transform(
                            new Date(eachOne.submit_time),
                            'MMM dd,yyyy h:mm a',
                        );
                    }
                });
                this.earnedlist = _.concat(this.earnedlist, resp.earnedlist);
                this.consumedlist = resp.consumedlist;
                this.consumedlist.forEach((each: any) => {
                    if (each.revoked_date) {
                        each.revoked_date = this.datePipe.transform(new Date(each.revoked_date), 'MMM dd yyyy h:mm a');
                        if (each.badge !== 0) {
                            each.revokebadge = '- ' + each.badge;
                        } else {
                            each.revokebadge = 0;
                        }
                        if (each.superbadge !== 0) {
                            each.revokesuperbadge = '- ' + each.superbadge;
                        } else {
                            each.revokesuperbadge = 0;
                        }
                    }
                    each.date = this.datePipe.transform(new Date(each.date), 'MMM dd yyyy h:mm a');
                });
                this.consumedlist.sort((a, b) => {
                    let dateA: any;
                    let dateB: any;
                    dateA = new Date(a.date);
                    dateB = new Date(b.date);
                    return dateB - dateA;
                });
                _.forEach(this.penalizedList, (eachOne: any) => {
                    if (eachOne.date) {
                        eachOne.date = this.datePipe.transform(new Date(eachOne.date), 'MMM dd,yyyy h:mm a');
                    }
                });
            }
        });
    }
    addBulkBadges() {
        this.addBulkBadgesDialog = true;
        this.badgedialog = true;
    }
    updateBadgeSuperbadge(carValue, type) {
        let user_ids: any = [];
        if (type === 'badge' && !this.addBadge) {
            this.showGrowl('error', 'Failed!', 'Add valid Badge value');
            return;
        } else if (type === 'superbadge' && !this.addSuperbadge) {
            this.showGrowl('error', 'Failed!', 'Add valid SuperBadge value');
            return;
        }
        this.blocked = true;
        this.globalservice.setDoneState(true);
        if (this.addBulkBadgesDialog) {
            if (this.selectAllFlag) {
                this.studentsAddBadgesSuperbadges(type);
                return;
            } else {
                user_ids = _.map(this.selectedStudents, 'id');
            }
        } else {
            user_ids.push(carValue.id);
        }
        let payload: any;
        if (type === 'superbadge') {
            payload = {
                user_id: user_ids,
                add: this.addSuperbadge,
                type,
            };
            this.currentSuperbadge = this.currentSuperbadge + this.addSuperbadge;
            this.addSuperbadge = null;
        } else {
            payload = {
                user_id: user_ids,
                add: this.addBadge,
                type,
            };
            this.currentBadge = this.currentBadge + this.addBadge;
            this.addBadge = null;
        }
        this.UsersService.updateBadgeSuperbadge(payload).subscribe((res: any) => {
            const resp = res;
            if (resp.success) {
                this.blocked = false;
                this.globalservice.setDoneState(false);
                _.forEach(this.studentListData, (eachStudent: any) => {
                    if (user_ids.includes(eachStudent.id)) {
                        eachStudent[type] = eachStudent[type] + payload.add;
                    }
                });
                const newData: any = resp.data;
                if (newData.length === 1) {
                    if (newData[0].staff) {
                        newData[0].staff = this.getName(newData[0].staff);
                    }
                    if (newData[0].date) {
                        newData[0].date = this.datePipe.transform(new Date(newData[0].date), 'MMM dd,yyyy h:mm a');
                    }
                    this.earnedlist.push(newData[0]);
                }
                if (type === 'superbadge') {
                    this.studentsMsg.push({
                        severity: 'success',
                        summary: 'Updated Successfully',
                        detail: 'Student Superbadge Updated Successfully',
                    });
                    setTimeout(() => {
                        this.studentsMsg = [];
                    }, 3000);
                } else {
                    this.studentsMsg.push({
                        severity: 'success',
                        summary: 'Updated Successfully',
                        detail: 'Student Badge Updated Successfully',
                    });
                    setTimeout(() => {
                        this.studentsMsg = [];
                    }, 3000);
                }
            } else {
                this.blocked = false;
                this.globalservice.setDoneState(false);
                this.showGrowl('error', 'Unable to Add Badge or Super Badge', 'Something went wrong');
            }
        });
    }
    studentsAddBadgesSuperbadges(type) {
        let payload: any = {
            department: this.studentDepartment,
            enrolled_status: this.studentEnrollstatus,
            tags: this.studentTags,
            batch: this.studentBatch,
            degree: this.studentDegree,
            targetexam_id: this.studentTargetExam,
            search: this.searchTerm,
            school_id: this.school_id,
            user_role: 'student',
            verification_status: this.studentStatus,
            type,
        };
        if (type === 'superbadge') {
            (payload.add = this.addSuperbadge), (this.addSuperbadge = null);
        } else {
            (payload.add = this.addBadge), (this.addBadge = null);
        }
        payload.isPlacementInterested = this.isPlacementInterested;
        if (this.filterBranch) {
            payload.branch_id = this.filterBranch;
        } else {
            payload.all_branches = _.compact(_.map(this.branchList, 'value'));
        }
        payload = _.omitBy(payload, _.isNil);
        this.blocked = false;
        this.globalservice.setDoneState(false);
        if (type === 'superbadge') {
            this.studentsMsg.push({
                severity: 'success',
                summary: 'Updated Successfully',
                detail: 'Students Superbadge will be Updated in the background, please check after sometime',
            });
            setTimeout(() => {
                this.studentsMsg = [];
            }, 3000);
        } else {
            this.studentsMsg.push({
                severity: 'success',
                summary: 'Updated Successfully',
                detail: 'Students Badge will be Updated in the background, please check after sometime',
            });
            setTimeout(() => {
                this.studentsMsg = [];
            }, 3000);
        }
        this.UsersService.studentsAddBadgesSuperbadges(payload).subscribe(
            (response: any) => {},
            (error) => {
                this.showGrowl('error', 'Unable to Add Badge or Super Badge', 'Something went wrong');
            },
        );
    }
    choosebadgetype(type) {
        this.selectbadgetype = type;
    }
    badgesIncrement(number) {
        if (number || number >= 0) {
            number = number + 1;
            return number;
        }
    }
    bulkUpdate() {
        if (this.filterBranch && this.filterBranch.length && this.filterBranch.length === 1) {
            if (
                (this.institute_type === 'training_institute' &&
                    this.studentTargetexam &&
                    this.studentTargetexam.length) ||
                ((this.institute_type === 'college' || this.institute_type === 'company') &&
                    this.studentBatch &&
                    this.studentBatch.length)
            ) {
                this.enableBulkUpdate = false;
                this.call15 = this.schoolService
                    .getBranchwiseSchoolCustomFields(this.filterBranch[0], this.school_id)
                    .subscribe((resp: any) => {
                        let response = resp;
                        this.keySelected = [];
                        let promise_array;
                        this.basic_mandatory_fields = [];
                        promise_array = new Promise((resolve) => {
                            if (
                                response.studentCustomFields.student_custom_fields &&
                                response.studentCustomFields.student_custom_fields.basic_info_field
                            ) {
                                for (const data of response.studentCustomFields.student_custom_fields
                                    .basic_info_field) {
                                    if (data.hide === true) {
                                        this.basic_mandatory_fields.push(data.label);
                                    }
                                }
                            }
                            resolve(true);
                        });
                        promise_array.then((resl) => {
                            if (resl === true) {
                                if (
                                    response &&
                                    response.studentCustomFields &&
                                    response.studentCustomFields.student_custom_fields
                                ) {
                                    response = response.studentCustomFields.student_custom_fields.fields;
                                    if (response) {
                                        this.addFieldData = [];
                                        this.fieldDetails = [];
                                        this.addFieldDetails = [];
                                        response = _.filter(response, (eachF: any) => {
                                            return (
                                                eachF.type !== 'dob' &&
                                                eachF.type !== 'resume' &&
                                                eachF.type !== 'file_upload' &&
                                                eachF.type !== 'policy' &&
                                                !eachF.archive
                                            );
                                        });
                                        this.actualCustomFields = response.map((a) => Object.assign({}, a));
                                        this.addFieldData = this.UsersService.formatSameNameCustomField(response);
                                        _.forEach(this.basic_mandatory_fields, (each: any) => {
                                            if (each === '10th Percentage') {
                                                this.fieldDetails.push({
                                                    label: '10th',
                                                    value: ['Percentage', 'CGPA'],
                                                });
                                            } else if (each === '12th Percentage') {
                                                this.fieldDetails.push({
                                                    label: '12th',
                                                    value: ['Percentage', 'CGPA'],
                                                });
                                            } else if (each === 'Diploma Percentage') {
                                                this.fieldDetails.push({
                                                    label: 'Diploma',
                                                    value: ['Percentage', 'CGPA'],
                                                });
                                            } else if (each === 'UG CGPA') {
                                                this.fieldDetails.push({ label: 'Ug', value: ['Percentage', 'CGPA'] });
                                            } else if (each === 'PG CGPA') {
                                                this.fieldDetails.push({ label: 'Pg', value: ['Percentage', 'CGPA'] });
                                            } else if (each === 'Backlogs History') {
                                                this.fieldDetails.push({
                                                    label: 'Backlog_History',
                                                    value: ['Yes', 'No'],
                                                });
                                            } else if (each === 'Current Backlogs') {
                                                this.fieldDetails.push({ label: 'Current_Backlogs', value: [0, 50] });
                                            } else if (each === 'Interested for Placement') {
                                                this.fieldDetails.push({
                                                    label: 'Interested_for_Placement',
                                                    value: ['Yes', 'No'],
                                                });
                                            } else if (each === 'First Name') {
                                                this.basicDetails.push({
                                                    label: 'First_Name',
                                                    value: '',
                                                });
                                            } else if (each === 'Last Name') {
                                                this.basicDetails.push({
                                                    label: 'Last_Name',
                                                    value: '',
                                                });
                                            } else if (each === 'Gender') {
                                                this.basicDetails.push({
                                                    label: 'Gender',
                                                    value: ['Male', 'Female'],
                                                });
                                            } else if (each === 'Phone No') {
                                                this.basicDetails.push({
                                                    label: 'Phone_No',
                                                    value: '',
                                                });
                                            } else if (each === 'dob') {
                                                this.basicDetails.push({
                                                    label: 'DOB',
                                                    value: '',
                                                });
                                            } else if (each === 'Registration Number') {
                                                this.basicDetails.push({
                                                    label: 'Registration_Number',
                                                    value: '',
                                                });
                                            }
                                            else if (each === 'Reject Reason') {
                                                this.basicDetails.push({
                                                    label: 'Reject_Reason',
                                                    value: '',
                                                });
                                            }
                                            else if (each === 'Disable Reason') {
                                                this.basicDetails.push({
                                                    label: 'disable_Reason',
                                                    value: '',
                                                });
                                            }
                                        });
                                        for (const data of response) {
                                            if (
                                                data.type === 'radiobutton' ||
                                                data.type === 'checkbox' ||
                                                data.type === 'dropdown'
                                            ) {
                                                let obj: any = {};
                                                obj = {
                                                    type: data.type,
                                                    label: data.question,
                                                    value: _.map(data.option, 'value'),
                                                    cf_id: data.cf_id,
                                                };
                                                this.addFieldDetails.push(obj);
                                            } else if (data.type === 'shortanswer' || data.type === 'longanswer') {
                                                let obj: any = {};
                                                obj = {
                                                    type: data.type,
                                                    label: data.question,
                                                    cf_id: data.cf_id,
                                                };
                                                this.addFieldDetails.push(obj);
                                            }
                                        }
                                        this.bulkUpdateDialouge = true;
                                    }
                                }
                            }
                        });
                    });
                this.keySelected = [];
            } else {
                this.studentsMsg = [];
                this.studentsMsg.push({
                    severity: 'warn',
                    summary: 'Alert',
                    detail:
                        'Please select atleast one ' +
                        (this.institute_type === 'training_institute' ? 'Target Exam' : 'Batch') +
                        ' to bulk update',
                });
            }
        } else {
            if (this.filterBranch && this.filterBranch.length) {
                this.studentsMsg = [];
                this.studentsMsg.push({
                    severity: 'warn',
                    summary: 'Alert',
                    detail: 'Please select only one ' + this.Branch + ' to bulk update',
                });
            } else {
                this.studentsMsg = [];
                this.studentsMsg.push({
                    severity: 'warn',
                    summary: 'Alert',
                    detail: 'Please select a ' + this.Branch + ' to bulk update',
                });
            }
        }
    }
    closeBulkUpdate() {
        this.fieldDetails = [];
        this.addFieldDetails = [];
        this.basicDetails = [];
        this.bulkUpdateDialouge = false;
        this.showCSVDataTable = false;
        this.enableBulkUpdate = true;
        this.blocked = false;
        this.globalservice.setDoneState(false);
    }
    checkBulkUPdateBtn() {
        if (this.enableBulkUpdate === false) {
            return true;
        } else {
            return false;
        }
    }
    createSampleCSV() {
        if (this.keySelected === [] || this.keySelected.length === 0 || this.keySelected === null) {
            this.selectMsg = [];
            this.selectMsg.push({ severity: 'error', summary: 'Validation Failed', detail: 'Select any one field!' });
        } else {
            this.selectMsg = [];
            this.selectMsg.push({ severity: 'success', summary: 'Please wait', detail: 'The csv is generating !' });
            const formattedList: any[] = [];
            const arraydata: any[] = [1];
            const sampleList: any[] = [];
            _.forEach(arraydata, (each: any) => {
                sampleList.push(this.generateSampleCsvObject(each));
            });
            for (const key in sampleList[0]) {
                if (sampleList[0].hasOwnProperty(key)) {
                    const field: any = this.addFieldDetails.find((each: any) => {
                        return each.label === key;
                    });
                    if (field && field.cf_id) {
                        const keyWithId: any = key + '-cf_id-' + field.cf_id;
                        sampleList[0][keyWithId] = sampleList[0][key];
                        delete sampleList[0][key];
                    }
                }
            }
            formattedList.push(sampleList[0]);
            const csv = Papa.unparse(formattedList);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
            if (this.institute_type === 'company') {
                saveAs(blob, 'sample-candidate-list.csv');
            } else {
                saveAs(blob, 'sample-student-list.csv');
            }
            this.keySelected = [];
        }
    }
    checkUploadBtn() {
        if (this.keySelected === [] || this.keySelected.length === 0 || this.keySelected === null) {
            return true;
        } else {
            return false;
        }
    }
    bulkUpload(event) {
        let promise_array;
        if (event.target.files && event.target.files[0]) {
            this.blocked = true;
            this.globalservice.setDoneState(true);
            const reader = new FileReader();
            reader.onload = (e: any) => {
                if (this.validateUploadFile(e.target.result)) {
                    this.csvFile = event.target.files[0];
                    Papa.parse(this.csvFile, {
                        header: true,
                        complete: (results) => {
                            let keysMisMatch = false;
                            const sampleDataKeys = Object.keys(this.generateSampleCsvObject(1));
                            const sampleKeys: any = [];
                            sampleDataKeys.forEach((each: any) => {
                                const fieldPay: any = {};
                                const field: any = this.addFieldDetails.find((eachField: any) => {
                                    return each === eachField.label;
                                });
                                if (field && field.cf_id) {
                                    sampleKeys.push(field.cf_id);
                                } else {
                                    sampleKeys.push(each);
                                }
                            });
                            results.data.every((each: any) => {
                                if (each.email) {
                                    const userCSVKeys: any = [];
                                    Object.keys(each).forEach((eachK: any) => {
                                        const splitedArray: any = eachK.split('-cf_id-');
                                        if (splitedArray && splitedArray.length && splitedArray[1]) {
                                            userCSVKeys.push(splitedArray[1]);
                                        } else {
                                            userCSVKeys.push(eachK);
                                        }
                                    });
                                    for (const o in each) {
                                        if (each.hasOwnProperty(o)) {
                                            const splitedArray: any = o.split('-cf_id-');
                                            if (splitedArray && splitedArray.length && splitedArray[1]) {
                                                const field: any = this.addFieldDetails.find((eachField: any) => {
                                                    return splitedArray[1] === eachField.cf_id;
                                                });
                                                if (field && field.label) {
                                                    each[field.label] = each[o];
                                                    delete each[o];
                                                }
                                            }
                                        }
                                    }
                                    if (sampleKeys.length === userCSVKeys.length) {
                                        if (_.difference(sampleKeys, userCSVKeys).length) {
                                            keysMisMatch = true;
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        keysMisMatch = true;
                                        return false;
                                    }
                                } else {
                                    return true;
                                }
                            });
                            if (keysMisMatch) {
                                this.blocked = false;
                                this.globalservice.setDoneState(false);
                                this.selectMsg = [];
                                this.selectMsg.push({
                                    severity: 'error',
                                    summary: 'Validation Failed',
                                    detail: 'CSV does not match with the fields selected',
                                });
                            } else {
                                this.StaffStudentService.sendCSV(results.data);
                            }
                        },
                    });
                    event.srcElement.value = null;
                    this.checkColumn();
                    promise_array = new Promise((resolve) => {
                        this.StaffStudentService.listenCSV().subscribe((response: any) => {
                            this.csvData = response;
                            const arr_len = this.csvData.length;
                            if (this.csvData[arr_len - 1].email.length === 0) {
                                this.csvData = this.csvData.slice(0, this.csvData.length - 1);
                            }
                            this.checkRow(this.csvData).then((dresp) => {
                                if (dresp === true) {
                                    resolve(true);
                                } else {
                                    resolve(true);
                                }
                            });
                        });
                    });
                    promise_array.then((resl) => {
                        if (resl === true) {
                            this.blocked = false;
                            this.globalservice.setDoneState(false);
                            this.showCSVDatatable();
                        }
                    });
                } else {
                    this.selectMsg = [];
                    this.selectMsg.push({
                        severity: 'error',
                        summary: 'Validation Failed',
                        detail: 'Upload only .CSV file type!',
                    });
                }
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }
    validateUploadFile(file) {
        let s: string = file;
        s = s.substr(0, s.indexOf(';base64,'));
        if (s === 'data:text/csv' || s === 'data:application/vnd.ms-excel') {
            this.fileInvalidFormat = false;
            return true;
        }
        this.fileInvalidFormat = true;
        return false;
    }
    checkColumn() {
        this.tenthColumn = _.includes(this.keySelected, '10th');
        this.twelfthColumn = _.includes(this.keySelected, '12th');
        this.diplomaColumn = _.includes(this.keySelected, 'Diploma');
        this.ugColumn = _.includes(this.keySelected, 'Ug');
        this.pgColumn = _.includes(this.keySelected, 'Pg');
        this.curColumn = _.includes(this.keySelected, 'Current_Backlogs');
        this.backColumn = _.includes(this.keySelected, 'Backlog_History');
        this.intColumn = _.includes(this.keySelected, 'Interested_for_Placement');
        this.firstNameColumn = _.includes(this.keySelected, 'First_Name');
        this.genderColumn = _.includes(this.keySelected, 'Gender');
        this.dobColumn = _.includes(this.keySelected, 'DOB');
        this.lastNameColumn = _.includes(this.keySelected, 'Last_Name');
        this.phoneColumn = _.includes(this.keySelected, 'Phone_No');
        this.rollNoColumn = _.includes(this.keySelected, 'Registration_Number');
        if (this.firstNameColumn || this.lastNameColumn) {
            this.userAttributesArray.push('name');
        }
        if (this.genderColumn) {
            this.userAttributesArray.push('gender');
        }
        if (this.dobColumn) {
            this.userAttributesArray.push('dob');
        }
        if (this.phoneColumn) {
            this.userAttributesArray.push('phone');
            this.userAttributesArray.push('phone_number');
            this.userAttributesArray.push('phone_verified');
        }
        this.attributesarray.push('approved_by');
        if (this.rollNoColumn === true) {
            this.attributesarray.push('roll_no');
            this.userAttributesArray.push('roll_no');
        }
        if (this.tenthColumn === true) {
            this.attributesarray.push('tenth_marks', 'is_tenth_percentage', 'n_tenth_percentage');
        }
        if (this.twelfthColumn === true) {
            this.attributesarray.push('twelfth_marks', 'is_twelfth_percentage', 'n_twelfth_percentage');
        }
        if (this.diplomaColumn === true) {
            this.attributesarray.push('diploma_marks', 'is_diploma_percentage', 'n_diploma_percentage');
        }
        if (this.ugColumn === true) {
            this.attributesarray.push('ug_marks', 'is_ug_percentage', 'n_ug_percentage');
        }
        if (this.pgColumn === true) {
            this.attributesarray.push('pg_marks', 'is_pg_percentage', 'n_pg_percentage');
        }
        if (this.backColumn === true) {
            this.attributesarray.push('backlog_history');
        }
        if (this.curColumn === true) {
            this.attributesarray.push('current_backlogs');
        }
        if (this.intColumn === true) {
            this.attributesarray.push('interested_for_placement');
        }
    }
    checkRow(data): Promise<any> {
        return new Promise((resolved, rejected) => {
            this.csvHeader = [];
            this.keySelected.forEach((element) => {
                if (_.find(this.addFieldDetails, { label: element })) {
                    this.csvHeader.push(_.find(this.addFieldDetails, { label: element }));
                }
            });
            data.forEach((eachElement) => {
                if (eachElement.email.toLowerCase().match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,24}$/)) {
                    if (this.dobColumn) {
                        var pattern =/^([0-9]{2})\-([0-9]{2})\-([0-9]{4})$/;
                        if (
                            !(
                                eachElement['dob(DD-MM-YYYY)'] &&
                                eachElement['dob(DD-MM-YYYY)'].length === 10 &&
                                eachElement['dob(DD-MM-YYYY)'].split('-').length === 3 &&
                                eachElement['dob(DD-MM-YYYY)'][2] === '-' &&
                                eachElement['dob(DD-MM-YYYY)'][5] === '-'
                            ) || !pattern.test(eachElement['dob(DD-MM-YYYY)'])
                        ) {
                            eachElement['dob_error'] = 'true';
                        }
                    }
                    if (this.tenthColumn) {
                        if (eachElement.Tenth_mark) {
                            eachElement.Tenth_mark_percentage_cgpa = eachElement.Tenth_mark_percentage_cgpa.trim();
                            eachElement.Tenth_mark = eachElement.Tenth_mark.trim();
                            if (
                                eachElement.Tenth_mark >= 0 &&
                                eachElement.Tenth_mark <= 10 &&
                                eachElement.Tenth_mark_percentage_cgpa.toUpperCase() === 'CGPA'
                            ) {
                                eachElement['ten_error'] = 'true';
                            } else if (
                                eachElement.Tenth_mark >= 1 &&
                                eachElement.Tenth_mark <= 100 &&
                                eachElement.Tenth_mark_percentage_cgpa.toUpperCase() === 'PERCENTAGE'
                            ) {
                                eachElement['ten_error'] = 'true';
                            } else {
                                eachElement['ten_error'] = 'false';
                            }
                        } else {
                            eachElement['ten_error'] = 'false';
                        }
                    } else {
                        eachElement['ten_error'] = 'true';
                    }
                    if (this.twelfthColumn) {
                        if (eachElement.Twelfth_mark) {
                            eachElement.Twelfth_mark = eachElement.Twelfth_mark.trim();
                            eachElement.Twelth_mark_percentage_cgpa = eachElement.Twelth_mark_percentage_cgpa.trim();
                            if (
                                eachElement.Twelfth_mark >= 0 &&
                                eachElement.Twelfth_mark <= 10 &&
                                eachElement.Twelth_mark_percentage_cgpa.toUpperCase() === 'CGPA'
                            ) {
                                eachElement['twe_error'] = 'true';
                            } else if (
                                eachElement.Twelfth_mark >= 1 &&
                                eachElement.Twelfth_mark <= 100 &&
                                eachElement.Twelth_mark_percentage_cgpa.toUpperCase() === 'PERCENTAGE'
                            ) {
                                eachElement['twe_error'] = 'true';
                            } else if (eachElement.Twelfth_mark.toUpperCase() === 'NA') {
                                eachElement['twe_error'] = 'true';
                            } else {
                                eachElement['twe_error'] = 'false';
                            }
                        } else {
                            eachElement['twe_error'] = 'false';
                        }
                    } else {
                        eachElement['twe_error'] = 'true';
                    }
                    if (this.diplomaColumn) {
                        if (eachElement.Diploma_mark) {
                            eachElement.Diploma_mark = eachElement.Diploma_mark.trim();
                            eachElement.Diploma_mark_percentage_cgpa = eachElement.Diploma_mark_percentage_cgpa.trim();
                            if (
                                eachElement.Diploma_mark >= 0 &&
                                eachElement.Diploma_mark <= 10 &&
                                eachElement.Diploma_mark_percentage_cgpa.toUpperCase() === 'CGPA'
                            ) {
                                eachElement['dip_error'] = 'true';
                            } else if (
                                eachElement.Diploma_mark >= 1 &&
                                eachElement.Diploma_mark <= 100 &&
                                eachElement.Diploma_mark_percentage_cgpa.toUpperCase() === 'PERCENTAGE'
                            ) {
                                eachElement['dip_error'] = 'true';
                            } else if (eachElement.Diploma_mark.toUpperCase() === 'NA') {
                                eachElement['dip_error'] = 'true';
                            } else {
                                eachElement['dip_error'] = 'false';
                            }
                        } else {
                            eachElement['dip_error'] = 'false';
                        }
                    } else {
                        eachElement['dip_error'] = 'true';
                    }
                    if (this.ugColumn) {
                        if (eachElement.Ug_mark) {
                            eachElement.Ug_mark = eachElement.Ug_mark.trim();
                            eachElement.Ug_mark_percentage_cgpa = eachElement.Ug_mark_percentage_cgpa.trim();
                            if (
                                eachElement.Ug_mark >= 0 &&
                                eachElement.Ug_mark <= 10 &&
                                eachElement.Ug_mark_percentage_cgpa.toUpperCase() === 'CGPA'
                            ) {
                                eachElement['ug_error'] = 'true';
                            } else if (
                                eachElement.Ug_mark >= 1 &&
                                eachElement.Ug_mark <= 100 &&
                                eachElement.Ug_mark_percentage_cgpa.toUpperCase() === 'PERCENTAGE'
                            ) {
                                eachElement['ug_error'] = 'true';
                            } else if (eachElement.Ug_mark.toUpperCase() === 'NA') {
                                eachElement['ug_error'] = 'true';
                            } else {
                                eachElement['ug_error'] = 'false';
                            }
                        } else {
                            eachElement['ug_error'] = 'false';
                        }
                    } else {
                        eachElement['ug_error'] = 'true';
                    }
                    if (this.pgColumn) {
                        if (eachElement.Pg_mark) {
                            eachElement.Pg_mark = eachElement.Pg_mark.trim();
                            eachElement.Pg_mark_percentage_cgpa = eachElement.Pg_mark_percentage_cgpa.trim();
                            if (
                                eachElement.Pg_mark >= 0 &&
                                eachElement.Pg_mark <= 10 &&
                                eachElement.Pg_mark_percentage_cgpa.toUpperCase() === 'CGPA'
                            ) {
                                eachElement['pg_error'] = 'true';
                            } else if (
                                eachElement.Pg_mark >= 1 &&
                                eachElement.Pg_mark <= 100 &&
                                eachElement.Pg_mark_percentage_cgpa.toUpperCase() === 'PERCENTAGE'
                            ) {
                                eachElement['pg_error'] = 'true';
                            } else if (eachElement.Pg_mark.toUpperCase() === 'NA') {
                                eachElement['pg_error'] = 'true';
                            } else {
                                eachElement['pg_error'] = 'false';
                            }
                        } else {
                            eachElement['pg_error'] = 'false';
                        }
                    } else {
                        eachElement['pg_error'] = 'true';
                    }
                    if (this.curColumn) {
                        if (eachElement.Current_Backlogs) {
                            eachElement.Current_Backlogs = eachElement.Current_Backlogs.trim();
                            if (eachElement.Current_Backlogs % 1 === 0) {
                                if (eachElement.Current_Backlogs >= 0 && eachElement.Current_Backlogs <= 50) {
                                    eachElement['cur_error'] = 'true';
                                } else {
                                    eachElement['cur_error'] = 'false';
                                }
                            } else {
                                eachElement['cur_error'] = 'false';
                            }
                        } else {
                            eachElement['cur_error'] = 'false';
                        }
                    } else {
                        eachElement['cur_error'] = 'true';
                    }
                    if (this.backColumn) {
                        if (eachElement.Backlog_History) {
                            eachElement.Backlog_History = eachElement.Backlog_History.trim();
                            if (
                                eachElement.Backlog_History.toUpperCase() === 'YES' ||
                                eachElement.Backlog_History.toUpperCase() === 'Y' ||
                                eachElement.Backlog_History.toUpperCase() === 'N' ||
                                eachElement.Backlog_History.toUpperCase() === 'NO'
                            ) {
                                eachElement['back_error'] = 'true';
                            } else {
                                eachElement['back_error'] = 'false';
                            }
                        } else {
                            eachElement['back_error'] = 'false';
                        }
                    } else {
                        eachElement['back_error'] = 'true';
                    }
                    if (this.intColumn) {
                        if (eachElement.Interested_for_Placement) {
                            eachElement.Interested_for_Placement = eachElement.Interested_for_Placement.trim();
                            if (
                                eachElement.Interested_for_Placement.toUpperCase() === 'YES' ||
                                eachElement.Interested_for_Placement.toUpperCase() === 'Y' ||
                                eachElement.Interested_for_Placement.toUpperCase() === 'N' ||
                                eachElement.Interested_for_Placement.toUpperCase() === 'NO'
                            ) {
                                eachElement['int_error'] = 'true';
                            } else {
                                eachElement['int_error'] = 'false';
                            }
                        } else {
                            eachElement['int_error'] = 'false';
                        }
                    } else {
                        eachElement['int_error'] = 'true';
                    }
                }
                if (this.csvHeader.length > 0) {
                    eachElement['add_error'] = 'true';
                    const arrlength = this.csvHeader.length;
                    for (let i = 0; i < arrlength; i++) {
                        const key = this.csvHeader[i];
                        const columnLabel = key.label;
                        if (eachElement[columnLabel]) {
                            if (eachElement.add_error === 'true') {
                                if (key.type === 'radiobutton') {
                                    const rad_columnLabel = key.label;
                                    if (
                                        _.some(
                                            key.value,
                                            _.unary(_.partialRight(_.includes, eachElement[rad_columnLabel])),
                                        )
                                    ) {
                                        eachElement['radio_error'] = 'true';
                                    } else {
                                        eachElement['radio_error'] = 'false';
                                        eachElement.add_error = 'false';
                                    }
                                } else {
                                    eachElement['radio_error'] = 'true';
                                }
                                if (key.type === 'dropdown') {
                                    const drop_columnLabel = key.label;
                                    if (
                                        _.some(
                                            key.value,
                                            _.unary(_.partialRight(_.includes, eachElement[drop_columnLabel])),
                                        )
                                    ) {
                                        eachElement['drop_error'] = 'true';
                                    } else {
                                        eachElement['drop_error'] = 'false';
                                        eachElement.add_error = 'false';
                                    }
                                } else {
                                    eachElement['drop_error'] = 'true';
                                }
                                if (key.type === 'checkbox') {
                                    const check_columnLabel = key.label;
                                    let columnValue = eachElement[check_columnLabel];
                                    columnValue = columnValue.split(',');
                                    let boolean_data: any;
                                    _.forEach(columnValue, (eachstr) => {
                                        if (_.includes(key.value, eachstr)) {
                                            boolean_data = true;
                                        } else {
                                            boolean_data = false;
                                        }
                                    });
                                    if (boolean_data === true) {
                                        eachElement['check_error'] = 'true';
                                    } else {
                                        eachElement['check_error'] = 'false';
                                        eachElement.add_error = 'false';
                                    }
                                } else {
                                    eachElement['check_error'] = 'true';
                                }
                                if (key.type === 'longanswer') {
                                    const long_columnLabel = key.label;
                                    if (eachElement[long_columnLabel] !== null) {
                                        eachElement['long_error'] = 'true';
                                    } else {
                                        eachElement['long_error'] = 'false';
                                        eachElement.add_error = 'false';
                                    }
                                } else {
                                    eachElement['long_error'] = 'true';
                                }
                                if (key.type === 'shortanswer') {
                                    const short_columnLabel = key.label;
                                    if (eachElement[short_columnLabel] !== null) {
                                        eachElement['short_error'] = 'true';
                                    } else {
                                        eachElement['short_error'] = 'false';
                                        eachElement.add_error = 'false';
                                    }
                                } else {
                                    eachElement['short_error'] = 'true';
                                }
                            }
                        } else {
                            eachElement['add_error'] = 'false';
                        }
                    }
                } else {
                    eachElement['add_error'] = 'true';
                    eachElement['radio_error'] = 'true';
                    eachElement['drop_error'] = 'true';
                    eachElement['check_error'] = 'true';
                    eachElement['long_error'] = 'true';
                    eachElement['short_error'] = 'true';
                }
            });
            resolved(true);
        });
    }
    showCSVDatatable() {
        this.updateStudentDialog = true;
        this.showCSVDataTable = true;
    }
    hideCSVDatatable() {
        this.updateStudentDialog = false;
        this.showCSVDataTable = false;
        this.bulkUpdateDialouge = false;
    }
    customRowClass(rowData, rowIndex): string {
        try {
            let validTenth: boolean,
                validTwelfth: boolean,
                validDiploma: boolean,
                validUg: boolean,
                validPg: boolean,
                validCurrent: boolean,
                validBackLag: boolean,
                validAdd: boolean,
                validRadio: boolean,
                validDrop: boolean,
                validCheck: boolean,
                validShort: boolean,
                validLong: boolean,
                validInterested: boolean,
                validDob: boolean;
            rowData.email = rowData.email.toLowerCase().trim();
            this.phonePattern = /^[0-9]{6,16}$/;
            const email: string = rowData.email;
            if (email.toLowerCase().match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,24}$/) &&
            ((rowData.gender && rowData.gender.trim())
             && (rowData.gender.toUpperCase() === 'MALE' ||
                rowData.gender.toUpperCase() === 'FEMALE' ||
                rowData.gender.toUpperCase() === 'M' ||
                rowData.gender.toUpperCase() === 'F') || !rowData.gender) &&
            ((rowData.first_name &&
            rowData.first_name.trim()) || !rowData.first_name) &&
            ((rowData.last_name &&
            rowData.last_name.trim()) || !rowData.last_name)) {
                if (rowData.first_name === '') {
                    rowData.has_error = true;
                    return 'row_error_class';
                }
                if (rowData.last_name === '') {
                    rowData.has_error = true;
                    return 'row_error_class';
                }
                if (rowData.gender === '') {
                    rowData.has_error = true;
                    return 'row_error_class';
                }
                if (rowData.registration_number === '') {
                    rowData.has_error = true;
                    return 'row_error_class';
                }
                if (rowData.phone || rowData.phone === '') {
                    rowData.phone = rowData.phone.trim();
                    if (rowData.phone.match(this.phonePattern)) {
                        rowData.has_error = false;
                    } else {
                        rowData.has_error = true;
                        return 'row_error_class';
                    }
                    if (!rowData.country_code) {
                        rowData.has_error = true;
                        return 'row_error_class';
                    }
                }
                if (rowData.dob_error && rowData.dob_error === 'true') {
                    validDob = false;
                } else {
                    validDob = true;
                }
                if (rowData.ten_error && rowData.ten_error === 'true') {
                    validTenth = true;
                } else {
                    validTenth = false;
                }
                if (rowData.twe_error && rowData.twe_error === 'true') {
                    validTwelfth = true;
                } else {
                    validTwelfth = false;
                }
                if (rowData.dip_error && rowData.dip_error === 'true') {
                    validDiploma = true;
                } else {
                    validDiploma = false;
                }
                if (rowData.ug_error && rowData.ug_error === 'true') {
                    validUg = true;
                } else {
                    validUg = false;
                }
                if (rowData.pg_error && rowData.pg_error === 'true') {
                    validPg = true;
                } else {
                    validPg = false;
                }
                if (rowData.cur_error && rowData.cur_error === 'true') {
                    validCurrent = true;
                } else {
                    validCurrent = false;
                }
                if (rowData.back_error && rowData.back_error === 'true') {
                    validBackLag = true;
                } else {
                    validBackLag = false;
                }
                if (rowData.int_error && rowData.int_error === 'true') {
                    validInterested = true;
                } else {
                    validInterested = false;
                }
                if (rowData.add_error && rowData.add_error === 'true') {
                    validAdd = true;
                } else {
                    validAdd = false;
                }
                if (rowData.radio_error && rowData.radio_error === 'true') {
                    validRadio = true;
                } else {
                    validRadio = false;
                }
                if (rowData.drop_error && rowData.drop_error === 'true') {
                    validDrop = true;
                } else {
                    validDrop = false;
                }
                if (rowData.check_error && rowData.check_error === 'true') {
                    validCheck = true;
                } else {
                    validCheck = false;
                }
                if (rowData.long_error && rowData.long_error === 'true') {
                    validShort = true;
                } else {
                    validShort = false;
                }
                if (rowData.short_error && rowData.short_error === 'true') {
                    validLong = true;
                } else {
                    validLong = false;
                }
                if (
                    validTenth &&
                    validTwelfth &&
                    validDiploma &&
                    validUg &&
                    validPg &&
                    validCurrent &&
                    validBackLag &&
                    validAdd &&
                    validRadio &&
                    validDrop &&
                    validCheck &&
                    validShort &&
                    validLong &&
                    validInterested &&
                    validDob
                ) {
                    rowData.has_error = false;
                    return '';
                } else {
                    rowData.has_error = true;
                    return 'row_error_class';
                }
            }
            rowData.has_error = true;
            return 'row_error_class';
        } catch (error) {
            if (rowData) {
                rowData.has_error = true;
                return 'row_error_class';
            }
        }
    }
    uploadEditCSV() {
        if (this.filterBranch && this.filterBranch.length && this.filterBranch.length === 1) {
            this.csvData.forEach((eachStud: any) => {
                for (const data in eachStud) {
                    if (eachStud.hasOwnProperty(data)) {
                        const field: any = this.addFieldData.find((each: any) => {
                            return each.question === data;
                        });
                        if (field && field.cf_id) {
                            eachStud[field.cf_id] = eachStud[data];
                            delete eachStud[data];
                        }
                    }
                }
            });
            const payload: any = {};
            payload.csv = _.filter(this.csvData, { has_error: false });
            payload.school_id = this.school_id;
            payload.purpose = this.purpose;
            payload.school_code = this.schoolData.school_code;
            payload.approved_user_id = this.userdata.user_id;
            payload.branch_id = this.filterBranch[0];
            if (this.attributesarray.length > 0) {
                payload.attributesarray = this.attributesarray;
            }
            if (this.userAttributesArray.length > 0) {
                payload.userAttributesArray = this.userAttributesArray;
            }
            if (
                this.firstNameColumn ||
                this.lastNameColumn ||
                this.phoneColumn ||
                this.genderColumn ||
                this.rollNoColumn ||
                this.dobColumn
            ) {
                payload.usersUpdate = true;
            } else {
                payload.usersUpdate = false;
            }
            if (this.csvHeader.length > 0) {
                payload.additional_field = true;
                this.addFieldData.forEach((eachField: any) => {
                    const findData: any = _.find(this.actualCustomFields, (eachActual: any) => {
                        return eachActual.cf_id === eachField.cf_id;
                    });
                    if (findData && findData.question) {
                        eachField.question = findData.question;
                    }
                });
                payload.additional_field_data = this.addFieldData;
            } else {
                payload.additional_field = false;
            }
            if (payload.csv && payload.csv.length > 0) {
                this.call16 = this.StaffStudentService.bulkUpdate(payload).subscribe((response: any) => {
                    const val = response;
                    this.attributesarray = [];
                    this.userAttributesArray = [];
                    if (val.success === true) {
                        this.hideCSVDatatable();
                        this.selectMsg = [];
                        this.selectMsg.push({
                            severity: 'success',
                            summary: 'Update Successful!',
                            detail: 'The update will happen in background, Check after sometime !',
                        });
                    } else {
                        this.hideCSVDatatable();
                        this.selectMsg = [];
                        this.selectMsg.push({
                            severity: 'error',
                            summary: 'Sorry !',
                            detail: 'Something went wrong, Check after sometime !',
                        });
                    }
                });
            } else {
                this.hideCSVDatatable();
                this.selectMsg = [];
                this.selectMsg.push({
                    severity: 'error',
                    summary: 'Validate Error !',
                    detail: 'Every value in the csv contains error',
                });
            }
        } else {
            this.selectMsg = [];
            this.selectMsg.push({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please select one ' + this.Branch,
            });
        }
    }
    ngOnDestroy() {
        this.unSubscribe(this.call1);
        this.unSubscribe(this.call2);
        this.unSubscribe(this.call8);
        this.unSubscribe(this.call9);
        this.unSubscribe(this.call10);
        this.unSubscribe(this.call11);
        this.unSubscribe(this.call12);
        this.unSubscribe(this.call13);
        this.unSubscribe(this.call14);
        this.unSubscribe(this.call15);
        this.unSubscribe(this.call16);
        this.unSubscribe(this.call17);
    }
    unSubscribe(data) {
        if (data) {
            data.unsubscribe();
        } else {
            return false;
        }
    }
    private generateSampleCsvObject(each: any) {
        const temparray = _.cloneDeep(this.keySelected);
        const obj: any = {};
        obj['email'] =
            this.institute_type === 'company'
                ? 'candidate_' + each + '@example.com'
                : 'student_' + each + '@example.com';
        if (_.includes(temparray, 'First_Name')) {
            obj['first_name'] = 'Pepper';
            const indexs = _.indexOf(temparray, 'First_Name');
            temparray.splice(indexs, 1);
        }
        if (_.includes(temparray, 'Last_Name')) {
            obj['last_name'] = 'Tony';
            const indexs = _.indexOf(temparray, 'Last_Name');
            temparray.splice(indexs, 1);
        }
        if (_.includes(temparray, 'Gender')) {
            obj['gender'] = 'female';
            const indexs = _.indexOf(temparray, 'Gender');
            temparray.splice(indexs, 1);
        }
        if (_.includes(temparray, 'Phone_No')) {
            obj['country_code'] = '+91';
            obj['phone'] = '9908576783';
            const indexs = _.indexOf(temparray, 'Phone_No');
            temparray.splice(indexs, 1);
        }
        if (_.includes(temparray, 'DOB')) {
            obj['dob(DD-MM-YYYY)'] = '14-10-2020';
            const indexs = _.indexOf(temparray, 'DOB');
            temparray.splice(indexs, 1);
        }
        if (_.includes(temparray, 'Registration_Number')) {
            obj['registration_number'] = '100001';
            const indexs = _.indexOf(temparray, 'Registration_Number');
            temparray.splice(indexs, 1);
        }
        if (_.includes(temparray, '10th')) {
            obj['Tenth_mark'] = 'Enter the mark in range 0 - 100';
            const indexs = _.indexOf(temparray, '10th');
            temparray.splice(indexs, 1);
            obj['Tenth_mark_percentage_cgpa'] = 'Percentage or CGPA';
        }
        if (_.includes(temparray, '12th')) {
            obj['Twelfth_mark'] = 'Enter the mark in range 0 - 100';
            const indexs = _.indexOf(temparray, '12th');
            temparray.splice(indexs, 1);
            obj['Twelth_mark_percentage_cgpa'] = 'Percentage or CGPA';
        }
        if (_.includes(temparray, 'Diploma')) {
            obj['Diploma_mark'] = 'Enter the mark in range 0 - 100';
            const indexs = _.indexOf(temparray, 'Diploma');
            temparray.splice(indexs, 1);
            obj['Diploma_mark_percentage_cgpa'] = 'Percentage or CGPA';
        }
        if (_.includes(temparray, 'Ug')) {
            obj['Ug_mark'] = 'Enter the mark in range 0 - 100';
            const indexs = _.indexOf(temparray, 'Ug');
            temparray.splice(indexs, 1);
            obj['Ug_mark_percentage_cgpa'] = 'Percentage or CGPA';
        }
        if (_.includes(temparray, 'Pg')) {
            obj['Pg_mark'] = 'Enter the mark in range 0 - 100';
            const indexs = _.indexOf(temparray, 'Pg');
            temparray.splice(indexs, 1);
            obj['Pg_mark_percentage_cgpa'] = 'Percentage or CGPA';
        }
        if (_.includes(temparray, 'Current_Backlogs')) {
            const temp_curent = _.find(this.fieldDetails, { label: 'Current_Backlogs' });
            obj['Current_Backlogs'] = temp_curent.value[0] + ' - ' + temp_curent.value[1];
            const indexs = _.indexOf(temparray, 'Current_Backlogs');
            temparray.splice(indexs, 1);
        }
        if (_.includes(temparray, 'Backlog_History')) {
            const temp_back = _.find(this.fieldDetails, { label: 'Backlog_History' });
            obj['Backlog_History'] = temp_back.value[0] + ', ' + temp_back.value[1];
            const indexs = _.indexOf(temparray, 'Backlog_History');
            temparray.splice(indexs, 1);
        }
        if (_.includes(temparray, 'Interested_for_Placement')) {
            const temp_interested = _.find(this.fieldDetails, { label: 'Interested_for_Placement' });
            obj['Interested_for_Placement'] = temp_interested.value[0] + ', ' + temp_interested.value[1];
            const indexs = _.indexOf(temparray, 'Interested_for_Placement');
            temparray.splice(indexs, 1);
        }
        if (temparray.length > 0) {
            const arrlength = temparray.length;
            for (let i = arrlength - 1; i >= 0; i--) {
                const key = _.find(this.addFieldDetails, { label: temparray[i] });
                let str: any;
                if (key.type === 'radiobutton') {
                    str = key.value.join(', ');
                    const label = key.label;
                    obj[label] = 'Enter any one value from this data: ' + str;
                    temparray.splice(i, 1);
                } else if (key.type === 'dropdown') {
                    str = key.value.join(', ');
                    const label = key.label;
                    obj[label] = 'Enter any one value from this data: ' + str;
                    temparray.splice(i, 1);
                } else if (key.type === 'checkbox') {
                    str = key.value.join(',');
                    const label = key.label;
                    obj[label] = 'Enter one or many value from this data: ' + str;
                    temparray.splice(i, 1);
                } else if (key.type === 'shortanswer') {
                    const label = key.label;
                    obj[label] = 'Enter the data in Short Answer';
                    temparray.splice(i, 1);
                } else if (key.type === 'longanswer') {
                    const label = key.label;
                    obj[label] = 'Enter the data in Long Answer';
                    temparray.splice(i, 1);
                }
            }
        }
        return obj;
    }
    selectDefaults() {
        this.studentBatch = null;
        this.studentStatus = null;
        this.filterBranch = [];
        this.studentBatch = [];
        if (this.default_filter && this.default_filter['student_list']) {
            if (
                this.default_filter['student_list'].branch &&
                this.default_filter['student_list'].branch.length &&
                this.default_filter['student_list'].branch[0] &&
                this.default_filter['student_list'].branch[0] !== null
            ) {
                this.filterBranch = this.default_filter['student_list'].branch;
            } else {
                this.filterBranch.push(this.firstBranch);
            }
            if (this.institute_type === 'college' || this.institute_type === 'company') {
                if (
                    this.default_filter['student_list'].batch &&
                    this.default_filter['student_list'].batch.length &&
                    this.default_filter['student_list'].batch[0] &&
                    this.default_filter['student_list'].batch[0] !== null
                ) {
                    this.studentBatch = this.default_filter['student_list'].batch;
                } else {
                    let v: any = [];
                    let selectedBatches: any = [];
                    _.forEach(this.filterBranch, (eachSelectedBranch: any) => {
                        v = this.batchlisting.filter((element) => {
                            return eachSelectedBranch === element.branch_id;
                        });
                        if (v && v.length) {
                            selectedBatches = selectedBatches.concat(v);
                        }
                    });
                    if (selectedBatches) {
                        selectedBatches = _.map(selectedBatches, 'value');
                        this.studentBatch = selectedBatches;
                    }
                }
                this.batchListing = [];
                _.forEach(this.batchlisting, (eachExistingBatch) => {
                    if (this.filterBranch.includes(eachExistingBatch.branch_id)) {
                        this.batchListing.push(eachExistingBatch);
                    }
                });
            } else if (this.institute_type === 'training_institute') {
                if (
                    this.default_filter['student_list'].targetExam &&
                    this.default_filter['student_list'].targetExam.length
                ) {
                    this.studentTargetexam = this.default_filter['student_list'].targetExam;
                } else {
                    this.targetExamListing = [];
                    let v: any = [];
                    let selectedTarget: any = [];
                    _.forEach(this.filterBranch, (eachSelectedBranch: any) => {
                        v = this.targetexamlisting.filter((element) => {
                            return eachSelectedBranch === element.branch_id;
                        });
                        if (v && v.length) {
                            selectedTarget = selectedTarget.concat(v);
                        }
                    });
                    if (selectedTarget) {
                        selectedTarget = _.map(selectedTarget, 'value');
                        this.studentTargetexam = selectedTarget;
                    }
                }
                _.forEach(this.targetexamlisting, (eachExistingTarget) => {
                    if (this.filterBranch.includes(eachExistingTarget.branch_id)) {
                        this.targetExamListing.push(eachExistingTarget);
                    }
                });
            }
            if (this.default_filter['student_list'].status && this.default_filter['student_list'].status.length) {
                this.studentStatus = this.default_filter['student_list'].status[0];
            }
            if (this.default_filter['student_list'].tags && this.default_filter['student_list'].tags.length) {
                this.studentTags = this.default_filter['student_list'].tags;
            }
            if (this.default_filter['student_list'].searchTerm) {
                const term = this.default_filter['student_list'].searchTerm;
                this.searchTerm = term && term.length === 1 && term.charCodeAt(0) === 32 ? '' : term;
            }
        } else {
            this.filterBranch.push(this.firstBranch);
            if (this.institute_type === 'college' || this.institute_type === 'company') {
                let v: any = [];
                let selectedBatches: any = [];
                _.forEach(this.filterBranch, (eachSelectedBranch: any) => {
                    v = this.batchlisting.filter((element) => {
                        return eachSelectedBranch === element.branch_id;
                    });
                    if (v && v.length) {
                        selectedBatches = selectedBatches.concat(v);
                    }
                });
                if (selectedBatches) {
                    selectedBatches = _.map(selectedBatches, 'value');
                    this.studentBatch = selectedBatches;
                }
                this.batchListing = [];
                _.forEach(this.batchlisting, (eachExistingBatch) => {
                    if (this.filterBranch.includes(eachExistingBatch.branch_id)) {
                        this.batchListing.push(eachExistingBatch);
                    }
                });
            } else if (this.institute_type === 'training_institute') {
                let v: any = [];
                let selectedTarget: any = [];
                _.forEach(this.filterBranch, (eachSelectedBranch: any) => {
                    v = this.targetexamlisting.filter((element) => {
                        return eachSelectedBranch === element.branch_id;
                    });
                    if (v && v.length) {
                        selectedTarget = selectedTarget.concat(v);
                    }
                });
                if (selectedTarget) {
                    selectedTarget = _.map(selectedTarget, 'value');
                    this.studentTargetexam = selectedTarget;
                }
                this.targetExamListing = [];
                _.forEach(this.targetexamlisting, (eachExistingTarget) => {
                    if (this.filterBranch.includes(eachExistingTarget.branch_id)) {
                        this.targetExamListing.push(eachExistingTarget);
                    }
                });
            }
        }
        this.page = 1;
        if (this.filterBranch) {
            switch (this.institute_type) {
                case 'college':
                    this.defaultDegree();
                    break;
            }
            this.defaultDepartment();
        } else {
            this.purpose === 'Exams App' ? this.listingstudent(undefined) : this.ppaStudentList(undefined);
        }
        this.checkFilterCount();
    }
    defaultDegree() {
        this.degreelist = [];
        if (this.filterBranch) {
            for (let i = 0; i < this.totalDegree.length; i++) {
                if (this.filterBranch.includes(this.totalDegree[i].branch_id)) {
                    this.degreelist.push(this.totalDegree[i]);
                }
            }
        }
        if (
            this.default_filter &&
            this.default_filter['student_list'] &&
            this.default_filter['student_list'].degree &&
            this.default_filter['student_list'].degree.length
        ) {
            this.studentDegree = this.default_filter['student_list'].degree[0];
        } else {
            this.studentDegree = null;
        }
    }
    defaultDepartment() {
        this.departmentlist = [];
        if (this.filterBranch) {
            for (let i = 0; i < this.totalDepartment.length; i++) {
                if (this.filterBranch.includes(this.totalDepartment[i].branch_id)) {
                    this.departmentlist.push(this.totalDepartment[i]);
                }
            }
        }
        if (
            this.default_filter &&
            this.default_filter['student_list'] &&
            this.default_filter['student_list'].department &&
            this.default_filter['student_list'].department.length
        ) {
            this.studentDepartment = this.default_filter['student_list'].department[0];
        }
        this.purpose === 'Exams App' ? this.listingstudent(undefined) : this.ppaStudentList(undefined);
    }
    selectTableHeaders() {
        if (this.default_filter && this.default_filter['student_list'] && this.checkpath === '/student') {
            this.isRollno = this.default_filter['student_list'].isRollno;
            this.isRejectReason = this.default_filter['student_list'].isRejectReason;
            this.isDisableReason = this.default_filter['student_list'].isDisableReason;
            this.isCourses = this.default_filter['student_list'].isCourses;            
            this.isName = this.default_filter['student_list'].isName;
            this.isEmail = this.default_filter['student_list'].isEmail;
            this.isPhno = this.default_filter['student_list'].isPhno;
            this.isApplicationNo = this.default_filter['student_list'].isApplicationNo;
            this.isbadge = this.default_filter['student_list'].isbadge;
            this.isbadge1 = this.default_filter['student_list'].isbadge1
                ? this.default_filter['student_list'].isbadge1
                : false;
            this.isSuperBadge = this.default_filter['student_list'].isSuperBadge
                ? this.default_filter['student_list'].isSuperBadge
                : false;
            this.isDepartment = this.default_filter['student_list'].isDepartment;
            this.isDegree = this.default_filter['student_list'].isDegree;
            this.isPlaced = this.default_filter['student_list'].isPlaced;
            this.isStatus = this.default_filter['student_list'].isStatus;
            this.isBranch = this.default_filter['student_list'].isBranch;
            this.isTenth = this.default_filter['student_list'].isTenth;
            this.isTwelfth = this.default_filter['student_list'].isTwelfth;
            this.isDiploma = this.default_filter['student_list'].isDiploma;
            this.isUg = this.default_filter['student_list'].isUg;
            this.isPg = this.default_filter['student_list'].isPg;
            this.isBacklogs = this.default_filter['student_list'].isBacklogs;
            this.isBacklogHistory = this.default_filter['student_list'].isBacklogHistory;
            this.isApprovedby = this.default_filter['student_list'].isApprovedby;
            this.isapprovedAt = this.default_filter['student_list'].isapprovedAt;
            this.isrejectedBy = this.default_filter['student_list'].isrejectedBy;
            this.isrejectedAt = this.default_filter['student_list'].isrejectedAt;
            this.isTargetExam = this.default_filter['student_list'].isTargetExam;
            this.isInterested = this.default_filter['student_list'].isInterested;
            this.isShowInactive = this.default_filter['student_list'].isPortalAccess;
            this.isPortalC = this.default_filter['student_list'].isPortalC;
            this.isVerifiedPic = this.default_filter['student_list'].isVerifiedPic;
            this.isVerifiedResume = this.default_filter['student_list'].isVerifiedResume;
            this.isDriveInactive = this.default_filter['student_list'].isDrivePortalAccess;
            this.isPlacementInterested = this.default_filter['student_list'].isPlacementInterested;
        } else {
            this.isRollno = false;
            this.isRejectReason = false;
            this.isDisableReason = false;
            this.isCourses = false;
            this.isName = true;
            this.isEmail = true;
            this.isPhno = true;
            this.isApplicationNo = true;
            this.isbadge = true;
            this.isbadge1 = false;
            this.isSuperBadge = false;
            this.isDepartment = true;
            this.isDegree = true;
            this.isPlaced = true;
            this.isStatus = true;
            this.isBranch = false;
            this.isTenth = false;
            this.isTwelfth = false;
            this.isDiploma = false;
            this.isUg = false;
            this.isPg = false;
            this.isShowInactive = false;
            this.isPortalC = false;
            this.isVerifiedPic = false;
            this.isVerifiedResume = false;
            this.isBacklogs = false;
            this.isBacklogHistory = false;
            this.isApprovedby = false;
            this.isapprovedAt = false;
            this.isrejectedBy = false;
            this.isrejectedAt = false;
            this.isTargetExam = true;
            this.isDriveInactive = false;
            this.isInterested = false;
            this.isPlacementInterested = false;
        }
    }
    setTableDefaults() {
        const payload: any = {};
        if (
            this.filterBranch &&
            this.filterBranch.length &&
            ((this.institute_type === 'training_institute' &&
                this.studentTargetexam &&
                this.studentTargetexam.length) ||
                ((this.institute_type === 'college' || this.institute_type === 'company') &&
                    this.studentBatch &&
                    this.studentBatch.length))
        ) {
            payload.branch = this.filterBranch;
            if (this.studentDepartment) {
                payload.department = [this.studentDepartment];
            }
            if (this.studentDegree) {
                payload.degree = [this.studentDegree];
            }
            if (this.studentStatus) {
                payload.status = [this.studentStatus];
            }
            if (this.studentTags) {
                payload.tags = this.studentTags;
            }
            if (this.institute_type === 'college' || this.institute_type === 'company') {
                if (this.studentBatch) {
                    payload.batch = this.studentBatch;
                } else {
                    payload.batch = [];
                }
            } else if (this.institute_type === 'training_institute') {
                if (this.studentTargetexam) {
                    payload.targetExam = this.studentTargetexam;
                } else {
                    payload.targetExam = [];
                }
            }
            if (this.searchTerm) {
                payload.searchTerm = this.searchTerm;
            }
            if (this.isPortalC) {
                payload.isPortalC = this.isPortalC;
            }
            if (this.isVerifiedPic) {
                payload.isVerifiedPic = this.isVerifiedPic;
            }
            if (this.isVerifiedResume){
                payload.isVerifiedResume = this.isVerifiedResume;
            }
            if (this.isShowInactive) {
                payload.isPortalAccess = this.isShowInactive;
            }
            if (this.isDriveInactive) {
                payload.isDrivePortalAccess = this.isDriveInactive;
            }
            if (this.isPlacementInterested) {
                payload.isPlacementInterested = this.isPlacementInterested;
            }
            payload.isRollno = this.isRollno;
            payload.isName = this.isName;
            payload.isEmail = this.isEmail;
            payload.isPhno = this.isPhno;
            payload.isApplicationNo = this.isApplicationNo;
            payload.isbadge = this.isbadge;
            payload.isDepartment = this.isDepartment;
            payload.isDegree = this.isDegree;
            payload.isPlaced = this.isPlaced;
            payload.isStatus = this.isStatus;
            payload.isBranch = this.isBranch;
            payload.isTenth = this.isTenth;
            payload.isTwelfth = this.isTwelfth;
            payload.isDiploma = this.isDiploma;
            payload.isUg = this.isUg;
            payload.isPg = this.isPg;
            payload.isBacklogs = this.isBacklogs;
            payload.isBacklogHistory = this.isBacklogHistory;
            payload.isApprovedby = this.isApprovedby;
            payload.isapprovedAt = this.isapprovedAt;
            payload.isrejectedBy = this.isrejectedBy;
            payload.isrejectedAt = this.isrejectedAt;
            payload.isTargetExam = this.isTargetExam;
            if (this.purpose === 'Placement Process App') {            
                payload.isCourses = this.isCourses;
            }            
            this.default_filter['student_list'] = payload;
            localStorage.removeItem('default_filter');
            localStorage.setItem('default_filter', JSON.stringify(this.default_filter));
            payload.type = 'student_list';
            payload.user_id = this.user_id;
            payload.school_id = this.school_id;
            this.SettingsService.setTableDefaults(payload).subscribe((response: any) => {
                if (response && response.success) {
                    this.showGrowl('success', 'Saved', 'Table Defaults have been saved');
                } else {
                    this.showGrowl('error', 'Failed', 'Failed To Save Table Defaults');
                }
            });
        } else {
            this.showGrowl(
                'warn',
                'Warning',
                'Please select atleast one ' +
                    this.Branch +
                    ' and ' +
                    (this.institute_type === 'training_institute' ? 'Target Exam' : 'Batch'),
            );
        }
        if (this.searchTerm) {
            payload.searchTerm = this.searchTerm;
        }
        if (this.isPortalC) {
            payload.isPortalC = this.isPortalC;
        }
        if (this.isVerifiedPic) {
            payload.isVerifiedPic = this.isVerifiedPic;
        }
        if (this.isVerifiedResume){
            payload.isVerifiedResume = this.isVerifiedResume;
        }
        if (this.isShowInactive) {
            payload.isPortalAccess = this.isShowInactive;
        }
        if (this.isDriveInactive) {
            payload.isDrivePortalAccess = this.isDriveInactive;
        }
        if (this.isPlacementInterested) {
            payload.isPlacementInterested = this.isPlacementInterested;
        }
        payload.isRollno = this.isRollno;
        payload.isRejectReason = this.isRejectReason;
        payload.isDisableReason = this.isDisableReason;
        payload.isName = this.isName;
        payload.isEmail = this.isEmail;
        payload.isPhno = this.isPhno;
        payload.isApplicationNo = this.isApplicationNo;
        payload.isbadge = this.isbadge;
        payload.isbadge1 = this.isbadge1;
        payload.isSuperBadge = this.isSuperBadge;
        payload.isDepartment = this.isDepartment;
        payload.isDegree = this.isDegree;
        payload.isPlaced = this.isPlaced;
        payload.isStatus = this.isStatus;
        payload.isBranch = this.isBranch;
        payload.isTenth = this.isTenth;
        payload.isTwelfth = this.isTwelfth;
        payload.isDiploma = this.isDiploma;
        payload.isUg = this.isUg;
        payload.isPg = this.isPg;
        payload.isBacklogs = this.isBacklogs;
        payload.isBacklogHistory = this.isBacklogHistory;
        payload.isApprovedby = this.isApprovedby;
        payload.isapprovedAt = this.isapprovedAt;
        payload.isrejectedBy = this.isrejectedBy;
        payload.isrejectedAt = this.isrejectedAt;
        payload.isTargetExam = this.isTargetExam;
        payload.isInterested = this.isInterested;
        this.default_filter['student_list'] = payload;
        localStorage.removeItem('default_filter');
        localStorage.setItem('default_filter', JSON.stringify(this.default_filter));
        payload.type = 'student_list';
        payload.user_id = this.user_id;
        payload.school_id = this.school_id;
        this.SettingsService.setTableDefaults(payload).subscribe((response: any) => {
            if (response && response.success) {
                this.showGrowl('success', 'Saved', 'Table Defaults have been saved');
            } else {
                this.showGrowl('error', 'Failed', 'Failed To Save Table Defaults');
            }
            this.isSaveTableDefaults = false;
        });
    }
    tableDefaults() {
        if (
            this.filterBranch &&
            this.filterBranch.length &&
            ((this.institute_type === 'training_institute' &&
                this.studentTargetexam &&
                this.studentTargetexam.length) ||
                ((this.institute_type === 'college' || this.institute_type === 'company') &&
                    this.studentBatch &&
                    this.studentBatch.length))
        ) {
            this.isSaveTableDefaults = true;
        } else {
            this.showGrowl(
                'warn',
                'Warning',
                'Please select atleast one ' +
                    this.Branch +
                    ' and ' +
                    (this.institute_type === 'training_institute' ? 'Target Exam' : 'Batch'),
            );
        }
    }
    closeD() {
        this.isSaveTableDefaults = false;
    }
    checkFilterCount() {
        this.appliedCount = 0;
        if (this.studentEnrollstatus && this.studentEnrollstatus !== false && this.studentEnrollstatus !== 'All') {
            this.appliedCount++;
        }
        if (this.studentTargetExam && this.studentTargetExam !== 'All') {
            this.appliedCount++;
        }
        if (this.studentDepartment && this.studentDepartment !== 'All') {
            this.appliedCount++;
        }
        if (this.studentDegree && this.studentDegree !== 'All') {
            this.appliedCount++;
        }
        if (this.studentCourse && this.studentCourse !== 'All') {
            this.appliedCount++;
        }
        if (this.studentStatus && this.studentStatus !== 'All') {
            this.appliedCount++;
        }
        if (this.studentTags && this.studentTags !== 'All') {
            this.appliedCount++;
        }
        if (this.isShowInactive) {
            this.appliedCount++;
        }
        if (this.isDriveInactive) {
            this.appliedCount++;
        }
        if (this.isPlacementInterested) {
            this.appliedCount++;
        }
    }
    payloadGenerator() {
        const payload: any = {};
        payload.school_code = this.schoolData.school_code;
        payload.school_id = this.school_id;
        payload.department = this.studentDepartment ? this.studentDepartment : '';
        payload.degree = this.studentDegree ? this.studentDegree : '';
        payload.search = this.searchTerm;
        payload.tags = this.studentTags;
        payload.isPlacementInterested = this.isPlacementInterested;
        if (this.studentEnrollstatus !== null) {
            payload.enrolled_status = this.studentEnrollstatus;
        }
        if (this.studentBatch && this.studentBatch.length) {
            payload.batch = this.studentBatch;
        }
        if (this.studentTargetexam && this.studentTargetexam.length) {
            payload.targetexam_id = this.studentTargetexam;
        }
        if (this.studentStatus !== null) {
            payload.verification_status = this.studentStatus;
        }
        if (this.filterBranch && this.filterBranch.length) {
            payload.branch_id = this.filterBranch;
        } else {
            payload.all_branches = _.compact(_.map(this.branchList, 'value'));
        }
        payload.user_role = 'student';
        return payload;
    }
    editStudentConfirmation(_ids, _tags) {
        if (!_ids && !(_tags && _tags.length > 0) && !this.stdUpdateBatch && !this.stdUpdateDepartment) {
            this.selectMsg = [];
            this.selectMsg.push({
                severity: 'warn',
                summary: 'Validation Failed',
                detail: 'Enter atleast any one value !',
            });
            return;
        }
        if ((this.filterBranch && this.filterBranch.length === 1 && this.stdUpdateBatch) || this.stdUpdateDepartment) {
            this.confirmationService.confirm({
                message:
                    "The student's will be deactivated from all the courses.You can manually activate" +
                    " the student's to the course if needed.Do you want to proceed?",
                header: 'Confirmation',
                icon: 'icon icon-ios-help',
                accept: () => {
                    this.bulkEditSubmit(_ids, _tags);
                },
                reject: () => {
                    this.stdUpdateBatch = null;
                    this.stdUpdateDepartment = null;
                },
            });
        } else {
            this.bulkEditSubmit(_ids, _tags);
        }
    }
    downloadResume() {
        if (this.filterBranch && this.filterBranch.length) {
            if (this.selectAllFlag) {
                const payloadEmail = this.payloadGenerator();
                payloadEmail.isPlacementInterested = this.isPlacementInterested;
                payloadEmail.resumeFileFormat = this.schoolsMeta ? this.schoolsMeta.resumeFileFormat : null;
                (payloadEmail.recevier_email = this.email_id),
                    this.UsersService.resumeDownload(payloadEmail).subscribe((response: any) => {
                        if (response) {
                            this.showGrowl(
                                'success',
                                'Mail will be sent to your email id',
                                'This process will happen in the background, please check after sometime',
                            );
                        } else {
                            this.showGrowl('error', 'Failed', 'Resume download Failed');
                        }
                        this.selectedAction = null;
                        this.selectedStudents = [];
                        this.uncheckAll();
                    });
            } else {
                let emailIds = [];
                emailIds = this.selectedStudents.map((e) => {
                    return e.id;
                });
                const payload: any = {
                    user_id: emailIds,
                    name: this.selectedStudents.map((e) => {
                        return e.name;
                    }),
                    roll_no: this.selectedStudents.map((e) => {
                        return e.roll_no;
                    }),
                    email: this.selectedStudents.map((e) => {
                        return e.email;
                    }),
                    branch_name: this.selectedStudents.map((e) => {
                        return e.branch;
                    }),
                    department_name: this.selectedStudents.map((e) => {
                        return e.department;
                    }),
                    degree_name: this.selectedStudents.map((e) => {
                        return e.degree;
                    }),
                    batch_name: this.selectedStudents.map((e) => {
                        return e.batch;
                    }),
                    targetexam_name: this.selectedStudents.map((e) => {
                        return e.targetexam;
                    }),
                    resumeFileFormat: this.schoolsMeta ? this.schoolsMeta.resumeFileFormat : null,
                    recevier_email: this.email_id,
                    school_id: this.schoolData.school_id,
                    school_code: this.schoolData.school_code,
                };
                payload.user_role = 'student';
                this.UsersService.resumeDownload(payload).subscribe((response: any) => {
                    if (response) {
                        this.showGrowl(
                            'success',
                            'Mail will be sent to your email id',
                            'This process will happen in the background, please check after sometime',
                        );
                    } else {
                        this.showGrowl('error', 'Failed', 'Resume download Failed');
                    }
                    this.selectedAction = null;
                    this.selectedStudents = [];
                    this.uncheckAll();
                });
            }
        } else {
            this.showGrowl('warn', 'Warning', 'Please select atleast one ' + this.Branch + ' to download the resume');
        }
    }
    downloadCancel() {
        this.showDownload = false;
        this.isStudentName = false;
        this.isStudentNameSplit = false;
        this.isStudentEmail = false;
        this.isStudentdob = false;
        this.isStudentRno = false;
        this.isStudentRejectReason = false;
        this.isStudentDisableReason = false;
        this.isStudentCourses = false;
        this.isPortalAccessStatus = false;
        this.isVerifiedPicture = false;
        this.isVerifiedResumedownload = false;
        this.isApplicationNumber = false;
        this.isStudentPno = false;
        this.isStudentGender = false;
        this.isBadge = false;
        this.isSuperbadge = false;
        this.isStudentBranch = false;
        this.isStudentBatch = false;
        this.isStudentDepartment = false;
        this.isStudentDegree = false;
        this.isStudentStatus = false;
        this.isStudentTenth = false;
        this.isStudentTwelth = false;
        this.isStudentDiploma = false;
        this.isStudentUg = false;
        this.isStudentPg = false;
        this.isStudentCB = false;
        this.isStudentBH = false;
        this.isStudentCustom = false;
        this.isStudentAppBy = false;
        this.isInterestedPlacement = false;
        this.keysToCheck = [];
        this.isSelectAll = false;
        this.isSelectAllAdditionalCol = false;
        this.selectedCustomFields = [];
        this.isPlacedCount = false;
        this.emptyMessage = '';
    }
    selectall() {
        if (this.isSelectAll) {
            this.keysToCheck = [];
            this.isStudentName = true;
            this.isStudentNameSplit = false;
            this.isStudentEmail = true;
            this.isStudentdob = true;
            this.isStudentRno = true;
            this.isStudentRejectReason = true;
            this.isStudentDisableReason = true;
            this.isStudentCourses = true;
            this.isPortalAccessStatus = true;
            this.isVerifiedPicture = true;
            this.isVerifiedResumedownload = true;
            this.isApplicationNumber = true;
            this.isStudentPno = true;
            this.isStudentGender = true;
            this.isBadge = true;
            this.isSuperbadge = true;
            this.isInterestedPlacement = true;
            this.isStudentBranch = true;
            this.isStudentBatch = true;
            this.isStudentDepartment = true;
            this.isStudentDegree = true;
            this.isStudentStatus = true;
            this.isStudentTenth = true;
            this.isStudentTwelth = true;
            this.isStudentDiploma = true;
            this.isStudentUg = true;
            this.isStudentPg = true;
            this.isStudentCB = true;
            this.isStudentBH = true;
            this.isStudentCustom = true;
            this.isStudentAppBy = true;
            this.isPlacedCount = true;
            if (this.schoolData.school_code === 'sambhram' || this.schoolData.school_code === 'nstech196') {
                this.keysToCheck = [
                    'Name',
                    'Email',
                    'Registration Number',
                    'Reject Reason',
                    'Disable Reason',
                    'dob',
                    'Phone No',
                    'Gender',
                    'Badge',
                    'Superbadge',
                    this.Branch,
                    'Department',
                    'Status',
                    'Additional Info',
                    'Application Number',
                    'Portal Access Status',
                    'Verified Picture',
                    'Resume Uploaded',
                    'Placed Count',
                ];
            }
            else {
                this.keysToCheck = [
                    'Name',
                    'Email',
                    'Registration Number',
                    'Reject Reason',
                    'Disable Reason',
                    'dob',
                    'Phone No',
                    'Gender',
                    'Badge',
                    'Superbadge',
                    this.Branch,
                    'Department',
                    'Status',
                    'Additional Info',
                    'Portal Access Status',
                    'Verified Picture',
                    'Resume Uploaded',
                    'Placed Count',
                ]; 
            }
            if (this.institute_type !== 'training_institute') {
                this.keysToCheck.push('Batch');
            }
            if (this.institute_type === 'training_institute') {
                this.keysToCheck.push('Target exam');
            }
            if (this.institute_type === 'college') {
                this.keysToCheck.push('Degree');
                this.keysToCheck.push('Enrolled Courses');
            }
            if (this.purpose === 'Recruitment' || this.purpose === 'Placement Process App') {
                this.keysToCheck.push(
                    'Tenth Mark',
                    'Twelfth Mark',
                    'Diploma Mark',
                    'Ug Mark',
                    'Pg Mark',
                    'Current Backlogs',
                    'Backlog History',
                );
            }
            if (this.purpose === 'Placement Process App') {
                this.keysToCheck.push('Approved By', 'Interested for Placement');
            }
        } else {
            this.isStudentName = false;
            this.isStudentNameSplit = false;
            this.isStudentEmail = false;
            this.isStudentdob = false;
            this.isStudentRno = false;
            this.isStudentRejectReason = false;
            this.isStudentDisableReason = false;
            this.isStudentCourses = false;
            this.isPortalAccessStatus = false;
            this.isVerifiedPicture = false;
            this.isVerifiedResumedownload = false;
            this.isApplicationNumber = false;
            this.isStudentPno = false;
            this.isStudentGender = false;
            this.isBadge = false;
            this.isSuperbadge = false;
            this.isStudentBranch = false;
            this.isStudentBatch = false;
            this.isStudentDepartment = false;
            this.isStudentDegree = false;
            this.isStudentStatus = false;
            this.isStudentTenth = false;
            this.isStudentTwelth = false;
            this.isStudentDiploma = false;
            this.isStudentUg = false;
            this.isStudentPg = false;
            this.isStudentCB = false;
            this.isStudentBH = false;
            this.isStudentCustom = false;
            this.isStudentAppBy = false;
            this.isInterestedPlacement = false;
            this.keysToCheck = [];
            this.isPlacedCount = false;
        }
    }
    preferredAll() {
        this.selectedCustomFields = [];
        if (this.isSelectAllAdditionalCol) {
            for (let i = 0; i < this.customFields.length; i++) {
                this.selectedCustomFields.push(this.customFields[i].cf_id);
                this.customFields[i].selected = true;
            }
        } else {
            for (let i = 0; i < this.customFields.length; i++) {
                this.customFields[i].selected = false;
            }
        }
    }
    downloadData() {
        if (this.keysToCheck.length !== 0) {
            if (this.keysToCheck && this.keysToCheck.length) {
                if (this.isStudentNameSplit) {
                    this.keysToCheck.unshift('Last Name');
                    this.keysToCheck.unshift('First Name');
                    const index = this.keysToCheck.findIndex((k: any) => {
                        return k === 'Split Name';
                    });
                    this.keysToCheck.splice(index, 1);
                }
                this.downloadCSVAction = true;
                this.show_loader = true;
                const formattedList: any[] = [];
                let promise_array: any = [];
                this.downloadSchoolFields = [];
                this.showGrowl('success', 'File will be downloaded in a moment', 'Loading...');
                promise_array.push(
                    new Promise((resolve) => {
                        if (this.filterBranch && this.filterBranch.length) {
                            if (this.selectedCustomFields && this.selectedCustomFields.length) {
                                this.keySelected = [];
                                this.downloadSchoolFields = this.customFields;
                                                this.downloadSchoolFields = this.UsersService.formatSameNameCustomField(
                                                    this.downloadSchoolFields,
                                                );
                                                resolve(true);
                            } else {
                                resolve(true);
                            }
                        } else {
                            resolve(true);
                        }
                    }),
                );
                promise_array.push(
                    new Promise((resolve) => {
                        this.ppaFormatList().then((res) => {
                            resolve(true);
                        });
                    }),
                );
                Promise.all(promise_array).then((resl) => {
                    _.forEach(this.FulldownloadData, (each: any) => {
                        let obj: any = {};
                        let checkDriveDisable : any = false;
                        if(each.markData && each.markData.reject_reason && each.markData.reject_reason.disablestudentfordrives === true){
                            checkDriveDisable = true;
                        }
                        else{
                            checkDriveDisable = false;
                        }
                        if (each.name && this.isStudentName) {
                            obj['Name'] = each.name;
                        } else if (each.f_name && each.l_name && this.isStudentNameSplit) {
                            obj['First Name'] = each.f_name;
                            obj['Last Name'] = each.l_name;
                        }
                        obj['Email'] = each.email;
                        obj['dob'] = each.dob === '-' ? '-' : this.datePipe.transform(each.dob, this.globalservice.getDateFormat(),);
                        obj['Registration Number'] = each.roll_no;
                        obj['Reject Reason'] = (each.status === 'Rejected' && each.reject_reason) ? each.reject_reason : '-' ;
                        obj['Phone No'] = each.phoneno;
                        obj['Gender'] = each.gender ? each.gender : '-';
                        obj[this.Branch] = each.branch;
                        if (this.institute_type === 'college' || this.purpose === 'Recruitment') {
                            obj['Batch'] = each.batch ? each.batch : '-';
                        }
                        if (this.institute_type === 'training_institute') {
                            obj['Target exam'] = each.targetexam;
                        }
                        obj['Department'] = each.department;
                        obj['Badge'] = each.badge ? each.badge : '-';
                        obj['Superbadge'] = each.superbadge ? each.superbadge : '-';
                        if (this.institute_type === 'college') {
                            obj['Degree'] = each.degree;
                        }
                        obj['Status'] = checkDriveDisable === true ? each.status +' -'+this.drivesService.drivesNameFormatView.drivesNamelist.label+' Disabled': each.status;
                        if (this.purpose === 'Recruitment' || this.purpose === 'Placement Process App') {
                            obj['Tenth Mark'] = each.tenth;
                            obj['Twelfth Mark'] = each.twelfth;
                            obj['Diploma Mark'] = each.diploma;
                            obj['Ug Mark'] = each.ug;
                            obj['Pg Mark'] = each.pg;
                            obj['Current Backlogs'] = each.currentBack;
                            obj['Backlog History'] = each.backlog;
                        }
                        if (this.purpose === 'Placement Process App') {
                            obj['Approved By'] = each.approvedBy;
                            obj['Interested for Placement'] = each.interested;
                            obj['Enrolled Courses'] = each.Courses ? each.Courses : ''; 
                        }
                        obj['Portal Access Status'] = each.portal_access_status ? each.portal_access_status : null;
                        obj['Disable Reason'] = each.disable_Reason ? each.disable_Reason : ''; 
                        
                        obj['Verified Picture'] = each.verified_pic ? 'Yes' : 'No';
                        obj['Resume Uploaded'] = each.verified_resume;
                        if (this.schoolData.school_code === 'sambhram' || this.schoolData.school_code === 'nstech196') {  
                            if (each.application_no && each.application_no < 10) {
                                each.application_no = 'SUB/IFB-001/000'+ each.application_no;
                            } else if (each.application_no && each.application_no < 100) {
                                each.application_no = 'SUB/IFB-001/00'+ each.application_no;
                            } else if (each.application_no && each.application_no < 1000) {
                                each.application_no = 'SUB/IFB-001/0'+ each.application_no;
                            } else if (each.application_no) {
                                each.application_no = 'SUB/IFB-001/'+ each.application_no;
                            }
                            obj['Application Number'] = each.application_no ? each.application_no : '-'; 
                        } else {
                            obj['Application Number'] = '-';
                        }
                        obj['Placed Count'] = each.placed_count ? each.placed_count : '-';
                        obj = this.pick(obj, this.keysToCheck);
                        if (this.selectedCustomFields && this.selectedCustomFields.length) {                         
                            if (each.student_custom_fields && each.student_custom_fields.length > 0) {                              
                                this.downloadSchoolFields.forEach((each1: any) => {
                                    if (
                                        each1.type !== 'resume' &&
                                        each1.type !== 'dob' &&
                                        each1.type !== 'file_upload' &&
                                        each1.type !== 'policy' &&
                                        !each1.archive
                                    ) {
                                        if (
                                            this.selectedCustomFields.includes(each1.cf_id)
                                        ) {
                                            const fields: any = each.student_custom_fields.find((each: any) => {
                                                return each.cf_id === each1.cf_id;
                                            });
                                            if (fields && fields.question) {
                                                obj[each1.label] = fields.answer === null ? '-' : fields.answer;
                                            } else {
                                                obj[each1.label] = '-';
                                            }
                                        }
                                    }
                                });
                            } else {
                                this.downloadSchoolFields.forEach((each1: any) => {
                                    if (
                                        each1.type !== 'resume' &&
                                        each1.type !== 'dob' &&
                                        each1.type !== 'file_upload' &&
                                        each1.type !== 'policy' &&
                                        !each1.archive
                                    ) {
                                     if (
                                            this.selectedCustomFields.includes(each1.cf_id)
                                        ) {
                                            obj[each1.label] = '-';
                                        }
                                    }
                                });
                            }
                        }
                        formattedList.push(obj);
                    });
                    let fileName: any = this.institute_type === 'company' ? 'candidate-list' : 'student-list';
                    fileName = fileName + '_' + this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:mm',);
                    if (this.downloadFileType === 'csv') {
                        const csv = Papa.unparse(formattedList);
                        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
                        saveAs(blob, fileName + '.csv');
                    } else {
                        this.globalservice.downloadAsExcel(formattedList, fileName);
                    }
                    this.show_loader = false;
                    this.downloadCancel();
                    this.downloadFileType = 'csv';
                    this.selectedCustomFields = [];
                });
            }
        } else {
            this.showGrowl('warn', 'Unable to Download', 'Please select atleast one field');
        }
    }
    setKeysToCheck(key) {
        this.isSelectAll =
            (this.purpose === 'Placement Process App' &&
                this.isStudentDegree &&
                this.isStudentAppBy &&
                this.isStudentTenth &&
                this.isStudentTwelth &&
                this.isStudentDiploma &&
                this.isStudentUg &&
                this.isStudentPg &&
                this.isStudentCB &&
                this.isStudentBH &&
                this.isStudentBatch &&
                this.isStudentName &&
                this.isStudentEmail &&
                this.isStudentRno &&
                this.isStudentRejectReason &&
                this.isStudentDisableReason &&
                this.isStudentCourses &&
                this.isStudentPno &&
                this.isStudentGender &&
                this.isBadge &&
                this.isSuperbadge &&
                this.isStudentdob &&
                this.isInterestedPlacement &&
                this.isStudentBranch &&
                this.isStudentDepartment &&
                this.isStudentStatus &&
                this.isStudentCustom &&
                this.isPortalAccessStatus &&
                this.isVerifiedPicture &&
                this.isVerifiedResumedownload &&
                this.isApplicationNumber && 
                this.isPlacedCount
            ) ||
            (this.purpose === 'Recruitment' &&
                this.isStudentTenth &&
                this.isStudentTwelth &&
                this.isStudentDiploma &&
                this.isStudentUg &&
                this.isStudentPg &&
                this.isStudentCB &&
                this.isStudentBH &&
                this.isStudentBatch &&
                this.isStudentName &&
                this.isStudentEmail &&
                this.isStudentRno &&
                this.isStudentRejectReason &&
                this.isStudentDisableReason &&                
                this.isStudentPno &&
                this.isStudentGender &&
                this.isBadge &&
                this.isStudentdob &&
                this.isSuperbadge &&
                this.isStudentBranch &&
                this.isStudentDepartment &&
                this.isStudentStatus &&
                this.isStudentCustom &&
                this.isPortalAccessStatus &&
                this.isVerifiedPicture &&
                this.isVerifiedResumedownload &&
                this.isApplicationNumber && 
                this.isPlacedCount
            ) ||
            (this.purpose === 'Exams App' &&
                this.institute_type !== 'training_institute' &&
                this.isStudentBatch &&
                this.isStudentDegree &&
                this.isStudentName &&
                this.isStudentEmail &&
                this.isStudentRno &&
                this.isStudentRejectReason &&
                this.isStudentDisableReason &&
                this.isStudentPno &&
                this.isStudentGender &&
                this.isBadge &&
                this.isSuperbadge &&
                this.isStudentdob &&
                this.isStudentBranch &&
                this.isStudentDepartment &&
                this.isStudentStatus &&
                this.isStudentCustom &&
                this.isPortalAccessStatus &&
                this.isVerifiedPicture &&
                this.isVerifiedResumedownload &&
                this.isApplicationNumber && 
                this.isPlacedCount
            ) ||
            (this.purpose === 'Exams App' &&
                this.institute_type === 'training_institute' &&
                this.isStudentBatch &&
                this.isStudentName &&
                this.isStudentEmail &&
                this.isStudentRno &&
                this.isStudentRejectReason &&
                this.isStudentDisableReason &&
                this.isStudentPno &&
                this.isStudentGender &&
                this.isStudentdob &&
                this.isBadge &&
                this.isSuperbadge &&
                this.isStudentBranch &&
                this.isStudentDepartment &&
                this.isStudentStatus &&
                this.isStudentCustom &&
                this.isPortalAccessStatus &&
                this.isVerifiedPicture &&
                this.isVerifiedResumedownload &&
                this.isApplicationNumber && 
                this.isPlacedCount
                )
                ? true
                : false;
        const index = this.keysToCheck.findIndex((k: any) => {
            return k === key;
        });
        if (index >= 0) {
            this.keysToCheck.splice(index, 1);
        } else {
            this.keysToCheck.push(key);
        }
    }
    pick(object, keys) {
        return keys.reduce((obj, key) => {
            if (object && object.hasOwnProperty(key)) {
                obj[key] = object[key];
            }
            return obj;
        }, {});
    }
    onKeyChange(key) {
        const index = this.selectedCustomFields.findIndex((k: any) => {
            return k == key;
        });
        if (index >= 0) {
            this.selectedCustomFields.splice(index, 1);
        } else {
            this.selectedCustomFields.push(key);
        }
        if (this.selectedCustomFields.length === this.customFields.length) {
            this.isSelectAllAdditionalCol = true;
        } else {
            this.isSelectAllAdditionalCol = false;
        }
    }
    public openBulkVerifiedPic() {
        this.bulkVerifiedPic.header = `<p>
      To update the verified picture of ${
          this.institute_type === 'company' ? 'candidates' : 'students'
      } in bulk by using zip file.</p>`;
        this.bulkVerifiedPic.content = `<b>Instructions:</b>
      <p>1. Collect the verified pictures with <b>email id as the file name</b> in a folder.</p>
      <p>2. Supported image formats are <b>.jpg, .jpeg, .png</b>.</p>
      <p>3. Compress the folder to a <b>.zip</b> file.</p>
      <p>4. Upload the zip using the <b>Upload</b> button below.</p>
      <p>5. Please wait till the upload process finishes.</p>
      <p>6. Verified pictures will be updated in the backend.</p>
      <p>7. After the completion of the update, you will receive a status email.</p>`;
        this.bulkVerifiedPic.uploadLabel = 'Upload';
        this.bulkVerifiedPic.closable = true;
        this.bulkVerifiedPic.progress = 0;
        this.bulkVerifiedPic.dialog = true;
    }
    public hideBulkVerifiedPic() {
        this.bulkVerifiedPic.dialog = false;
    }
    public uploadBulkVerifiedPic(event: any) {
        if (event.target.files && event.target.files[0]) {
            const onError = (msg = 'Error occurred. Try again!') => {
                this.bulkVerifiedPic.uploadLabel = 'Upload';
                this.bulkVerifiedPic.closable = true;
                this.bulkVerifiedPic.loading = false;
                this.showGrowl('error', 'Error', msg);
            };
            const zip: File = event.target.files[0];
            if (zip.type === 'application/x-zip-compressed' || zip.type === 'application/zip') {
                this.bulkVerifiedPic.closable = false;
                this.bulkVerifiedPic.loading = true;
                this.bulkVerifiedPic.progress = 0;
                this.showGrowl('warn', 'Uploading...', 'Please wait!');
                const reader = new FileReader();
                reader.onload = () => {
                    const fileKey = `${this.school_id}/verified-pic-zip/${zip.name}-${new Date().getTime()}.zip`;
                    this.testService
                        .loginCognito()
                        .then((login: any) => {
                            if (login) {
                                let status: any;
                                this.UploadFileService.uploadUsingSDK(fileKey, zip).subscribe(
                                    (uploadStat) => {
                                        status = uploadStat;
                                        this.bulkVerifiedPic.progress = uploadStat.progress;
                                        this.bulkVerifiedPic.uploadLabel = `Uploading...(${this.bulkVerifiedPic.progress}%)`;
                                    },
                                    (error) => {
                                        onError();
                                    },
                                    () => {
                                        if (status.Key) {
                                            this.UsersService.bulkUpdateVerifiedPic({
                                                zip_key: status.Key,
                                            }).subscribe(
                                                (bulkUpdate: any) => {
                                                    this.bulkVerifiedPic.uploadLabel = 'Upload';
                                                    this.bulkVerifiedPic.closable = true;
                                                    this.bulkVerifiedPic.loading = false;
                                                    const msg = {
                                                        severity: 'success',
                                                        summary: 'Success',
                                                        detail: 'Update initiated! Please check after sometime.',
                                                    };
                                                    if (!bulkUpdate.success) {
                                                        msg.severity = 'error';
                                                        msg.summary = 'Error';
                                                        msg.detail = bulkUpdate.message
                                                            ? bulkUpdate.message
                                                            : 'Error occurred. Try again later.';
                                                    }
                                                    this.showGrowl(msg.severity, msg.summary, msg.detail);
                                                },
                                                (error) => {
                                                    onError();
                                                },
                                            );
                                        } else {
                                            onError();
                                        }
                                    },
                                );
                            } else {
                                onError();
                            }
                        })
                        .catch((error) => {
                            onError();
                        });
                };
                reader.readAsDataURL(zip);
            } else {
                onError('Format not supported. Supported format is .zip');
            }
        } else {
            this.bulkVerifiedPic.loading = false;
        }
    }
    public downloadSampleVerifiedPic() {
        const sampleZipKey = `assets/sample-verified-pic-zip.zip`;
        const apiUrl = environment.HOST.link;
        let bucket = 'exams-media-stage';
        if (apiUrl.includes('.io')) {
            bucket = 'exams-media';
        }
        const anchor = document.createElement('a');
        anchor.href = `https://${bucket}.s3.amazonaws.com/${sampleZipKey}`;
        anchor.target = '_blank';
        anchor.download = 'sample-verified-pic-zip.zip';
        anchor.click();
    }
    closeSendMessage() {
        this.visibleSidebar = false;
        setTimeout(() => {
            this.selectedAction = null;
        }, 100);
        this.selectedStudents = [];
        this.messageType = undefined;
        this.pathPay = undefined;
        this.uncheckAll();
    }
    growlMsg(value) {
        this.selectMsg = [];
        this.selectMsg.push(value);
    }
    nullEvent(event) {
        event.target.value = '';
    }
    openbulkResetPasswordDialog() {
        this.bulkResetPasswordDialog = true;
        this.resetUploadDownload = 'download';
        this.bulkResetPasswordCsv = undefined;
    }
    uploadbulkResetPasswordCsv(event) {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                if (this.validateUploadFile(e.target.result)) {
                    let file: any = event.target.files[0];
                    Papa.parse(file, {
                        header: true,
                        complete: (results) => {
                            let keysMisMatch = false;
                            const sampleDataKeys = Object.keys(this.generatebulkResetPasswordCsvObject());
                            const sampleKeys: any = [];
                            sampleDataKeys.forEach((each: any) => {
                                sampleKeys.push(each);
                            });
                            results.data.forEach((each: any, index: any) => {
                                if (!(each && each.Custom_password)) {
                                    results.data.splice(index, 1);
                                }
                            });
                            results.data.every((each: any) => {
                                const userCSVKeys: any = [];
                                Object.keys(each).forEach((eachK: any) => {
                                    if (each[eachK]) {
                                        userCSVKeys.push(eachK);
                                    }
                                });
                                if (_.difference(sampleKeys, userCSVKeys).length) {
                                    keysMisMatch = true;
                                    return false;
                                } else {
                                    return true;
                                }
                            });
                            if (keysMisMatch) {
                                event.target.value = '';
                                this.globalservice.setDoneState(false);
                                this.selectMsg = [];
                                this.selectMsg.push({
                                    severity: 'error',
                                    summary: 'Validation Failed',
                                    detail: 'Please upload CSV with valid columns',
                                });
                            } else {
                                this.bulkResetPasswordCsv = {
                                    data: results.data,
                                    name: file.name,
                                };
                            }
                        },
                    });
                } else {
                    this.selectMsg = [];
                    this.selectMsg.push({
                        severity: 'error',
                        summary: 'Validation Failed',
                        detail: 'Upload only .CSV file type!',
                    });
                }
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }
    deleteCSV() {
        this.bulkResetPasswordCsv = undefined;
    }
    generatebulkResetPasswordCsvObject() {
        const obj: any = {};
        obj['Custom_password'] = 'demo@123';
        obj['Email_id'] = 'demo@examly.in';
        return obj;
    }
    cancelbulkResetPassword() {
        this.bulkResetPasswordDialog = false;
        this.bulkResetPasswordCsv = undefined;
    }
    bulkResetSampleCSV() {
        this.selectMsg = [];
        this.selectMsg.push({ severity: 'success', summary: 'Please wait', detail: 'The csv is generating !' });
        const formattedList: any[] = [];
        const sampleList: any[] = [];
        sampleList.push(this.generatebulkResetPasswordCsvObject());
        formattedList.push(sampleList[0]);
        const csv = Papa.unparse(formattedList);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'sample-bulk-reset.csv');
    }
    bulkResetPasswordCreate() {
        if (this.bulkResetPasswordCsv && this.bulkResetPasswordCsv.data && this.bulkResetPasswordCsv.data.length) {
            const pay: any = {
                userData: this.bulkResetPasswordCsv.data,
                school_id: this.schoolData.school_id,
                school_code: this.schoolData.school_code,
                isCsv: true,
                reqFrom: 'student'
            };
            this.StaffStudentService.bulkResetPassword(pay).subscribe(
                (response: any) => {
                    if (response) {
                        this.selectMsg = [];
                        this.selectMsg.push({
                            severity: 'success',
                            summary: 'Bulk Reset Password process started',
                            detail: 'You will receive a status email after sometime',
                        });
                    }
                },
                (failed: any) => {
                    this.selectMsg = [];
                    this.selectMsg.push({
                        severity: 'error',
                        summary: 'Updation Failed!',
                        detail: 'Please upload CSV with valid columns',
                    });
                    this.bulkResetPasswordDialog = false;
                },
            );
            this.bulkResetPasswordDialog = false;
        } else {
            this.selectMsg = [];
            this.selectMsg.push({
                severity: 'error',
                summary: 'Please select CSV file',
                detail: '',
            });
            this.bulkResetPasswordDialog = true;
        }
    }
    showPlacedDriveName(rowdata, event) {
        event.stopPropagation();
        if(rowdata.driveCount !== '-' ) {
            this.openPlacedDriveDialog =true;
            this.companyName = rowdata.placedDriveDetails;
        }
    }
    async downloadCFUploadedFile() {
        if (this.filterBranch.length === 1) {
            let date: any;
            let zipFileName: any;
            let cf_count: number = 0;
            let filePathArray: any = [];
            let fileNameArray: any = [];
            date = new Date().getTime().toString();
            if (this.selectAllFlag) {
                let payload: any = {};
                payload = this.payloadGenerator();
                payload.recevier_email = this.email_id;
                payload.cf_select_all = this.selectAllFlag;
                await this.UsersService.downloadZipCF(payload).subscribe((response: any) => {
                    if (response) {
                        this.showGrowl(
                            'success',
                            'Mail will be sent to your email id',
                            'This process will happen in the background, please check after sometime',
                        );
                    } else if (response === 'No Files') {
                        this.showGrowl(
                            'error',
                            'No uploaded file found',
                            'Select students were not uploaded the required file',
                        );
                    }
                    this.selectedAction = null;
                    this.selectedStudents = [];
                    this.uncheckAll();
                });
            } else {
                _.forEach(this.selectedStudents, (each: any) => {
                    if (each.student_custom_fields && each.student_custom_fields.length > 0) {
                        each.student_custom_fields[0].fields.forEach((each_1: any) => {
                            if (each_1.type === 'file_upload') {
                                cf_count += 1;
                                let filePath: any = "student_custom_fields" +
                                    '/' +
                                    each.markData.school_id +
                                    '/' +
                                    each.branch_id[0] +
                                    '/' +
                                    each.id;
                                let [name, extention] = each_1.answer.name.split(".");
                                let fileName: any = each.name +
                                    '_' +
                                    each.roll_no +
                                    '_' +
                                    each.email +
                                    '_' +
                                    each_1.question +
                                    '.' +
                                    extention;
                                fileNameArray.push(fileName);
                                filePath = filePath +
                                    '/' +
                                    each_1.cf_id +
                                    '/' +
                                    each_1.answer.name;
                                filePathArray.push(filePath);
                            }
                        });
                        zipFileName = "student_custom_fields" +
                            '/' +
                            each.markData.school_id +
                            '/' +
                            each.branch_id[0] +
                            '/' +
                            date +
                            '.zip';
                    }
                });
                if (cf_count === 0) {
                    this.showGrowl(
                        'error',
                        'No uploaded file found',
                        'Select students were not uploaded the required file',
                    );
                    this.selectedAction = null;
                    this.selectedStudents = [];
                    this.uncheckAll();
                } else {
                    let payload: any = {
                        cf_select_all: this.selectAllFlag,
                        filePath: filePathArray,
                        fileName: fileNameArray,
                        zipFileName: zipFileName,
                        toEmail: this.userdata.email,
                        school_code: this.schoolData.school_code,
                    };
                    await this.UsersService.downloadZipCF(payload).subscribe((response: any) => {
                        if (response) {
                            this.showGrowl(
                                'success',
                                'Mail will be sent to your email id',
                                'This process will happen in the background, please check after sometime',
                            );
                        }
                        this.selectedAction = null;
                        this.selectedStudents = [];
                        this.uncheckAll();
                    });
                }
            }
        } else {
            this.showGrowl(
                'error',
                'Select only one branch',
                'Select one branch',
            );
        }
    }
}