import { _getData } from "../../config/getData";

const mixin = {
    data() {
        return {
            defaultNav: 0
        }
    },
    created() {
        this.defaultNav = this.$route.query.nav_index;
    }
}

//获取验证码倒计时
const timer = {
    data() {
        return {
            content: "获取验证码", // 按钮里显示的内容
            totalTime: 60, //记录具体倒计时时间
            canClick: true, //添加canClick
            seccode_err: false, //控制验证码错误提示是否显示
        };
    },
    created() {

    },
    methods: {
        help() {
            return this.Error('phone1') || ''
        },
        gainCodeHandler(sectype = 6) {
            let val = this.form.getFieldValue('phone1')
            if (!this.phone1_success && !val) {
                console.log(this.$refs.phone1)
                this.$refs.phone1.help = '请输入手机号'
            }
            if (!this.canClick || !this.phone1_success) return;

            this.seccode_err = false
            this.canClick = false;

            _getData(`${this.$API_URL.HYGLOGINURL}/server/user!request.action`, {
                "method": "getCode",
                "userid": "",
                "token": "",
                "params": {
                    "phone": val,
                    "type": sectype
                }
            }).then(data => {
                if (data.code == 1101) {
                    this.phone1isRegister = true
                } else if (data.code == 1102) {
                    this.phone1isRegister = true
                }
            }).then(() => {

            })

            this.content = this.totalTime + "s";
            let clock = window.setInterval(() => {
                this.totalTime--;
                this.content = this.totalTime + "s";
                if (this.totalTime < 0) {
                    window.clearInterval(clock);
                    this.content = "获取验证码";
                    this.totalTime = 60;
                    this.canClick = true; //这里重新开启
                }
            }, 1000);



        },
        seccodeChange(e) {
            this.seccode_err = false;
        },
    }
}

//表单验证
const FormValidator = {
    data() {
        return {
            phone1_success: false, //手机号
            seccode_err: false, //验证码,
            phone2isRegister: true, //用户是否注册
            phone1isRegister: false
        }
    },
    mounted() {
        this.form.validateFields();
    },
    beforeCreate() {
        this.form = this.$form.createForm(this);
    },
    methods: {
        // handleSubmit(e) {
        //     e.preventDefault();
        //     this.seccode_err = true;
        //     this.form.validateFieldsAndScroll((err, values) => {
        //         if (!err) {
        //             console.log("Received values of form: ", values);
        //         }
        //     });
        // },
        hasErrors(fieldsError) {
            return Object.keys(fieldsError).some(field => {
                return fieldsError[field];
            });
        },
        seccodeChange(e) {
            this.seccode_err = false;
        },
        Error(field) {
            const {
                getFieldError,
                isFieldTouched,
                getFieldValue,
                setFieldsValue
            } = this.form;
            const val = getFieldValue(field);

            switch (field) {
                case "phone1":

                    this.phone1_success =
                        val && getFieldError(field) == undefined ? true : false;
                    if (!this.phone1_success) {
                        this.phone1isRegister = false
                    }
                    break;
                case "phone2":

                    this.phone2_success =
                        val != "" && getFieldError(field) == undefined ? true : false;
                    if (!this.phone2_success) {
                        this.phone2isRegister = true
                    }
            }
            return isFieldTouched(field) && getFieldError(field);
        }
    }
}

export {
    mixin,
    timer,
    FormValidator
}