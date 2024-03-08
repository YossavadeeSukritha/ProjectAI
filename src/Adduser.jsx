import './Adduser.css'
import Navbar from './Navbar'


function Adduser() {
    return (
        <>
            <Navbar />
            <div className="add-form">
                <form>
                    <div className="add-bar">
                        <h4>เพิ่มพนักงาน</h4>
                    </div>
                    <div className="all-form">
                        <div className="all-text">
                            <div className="form-group row">
                                <p className="col-sm-2 col-form-label">ID</p>
                                <div className="col-sm-10">
                                    <input type="text" className="form" />
                                </div>
                            </div>
                        </div>

                        <div className="all-text">
                            <div className="form-group row">
                                <p className="col-sm-2 col-form-label">ชื่อ-นามสกุล</p>
                                <div className="col-sm-10">
                                    <input type="text" className="form" />
                                </div>
                            </div>
                        </div>

                        <div className="all-text">
                            <div className="form-group row">
                                <p className="col-sm-2 col-form-label">วัน/เดือน/ปี</p>
                                <div className="col-sm-10">
                                    <input type="text" className="form" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="all-text">
                            <div className="form-group row">
                                <p className="col-sm-2 col-form-label">เพศ</p>
                                <div className="col-sm-10">
                                    <input type="text" className="form" />
                                </div>
                            </div>

                        </div>

                        <div className="all-text-end">
                            <div className="form-group row">
                                <p className="col-sm-2 col-form-label">รูป</p>
                                <div className="col-sm-10">
                                    <input type="file" className="form" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="btn-add">
                        <div className="col-sm-10">
                            <button type="button" className="btn-confirm">ยืนยัน</button>
                            <button type="button" className="btn-cancle">ยกเลิก</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Adduser
