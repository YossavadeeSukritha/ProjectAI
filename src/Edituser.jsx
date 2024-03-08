import './Edituser.css'
import Navbar from './Navbar';
import test from './assets/test.jpeg';

function Edituser() {
    return (
        <>
            <Navbar />
            <div className="container-xl px-4 mt-4">
                <div className="row">
                    <div className="col-xl-4">
                        {/* Profile picture card*/}
                        <div className="card mb-4 mb-xl-0">
                            <div className="card-header">Profile Picture</div>
                            <div className="card-body text-center">
                                {/* Profile picture image*/}
                                <img className="img-account-profile rounded-circle mb-2" src={test} />
                                {/* Profile picture help block*/}
                                <div className="small font-italic text-muted mb-4">Upload Picture</div>
                                {/* Profile picture upload button*/}
                                <input type="file" class="form-control" />
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-8">
                        {/* Account details card*/}
                        <div className="card mb-4">
                            <div className="card-header">Profile Details</div>
                            <div className="card-body">
                                <form>
                                    {/*ID*/}
                                    <div className="d-flex align-items-center justify-content-between mb-3 mt-4 ">
                                        <p className="mb-0">ID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                        <div className="flex-grow-1 ms-3">
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>

                                    {/* ชื่อ-นามสกุล*/}
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <p className="mb-0">ชื่อ-นามสกุล&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                        <div className="flex-grow-1 ms-3">
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>

                                    {/* วัน/เดือน/ปีเกิด*/}
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <p className="mb-0">วัน/เดือน/ปีเกิด&nbsp;&nbsp;&nbsp;</p>
                                        <div className="flex-grow-1 ms-3">
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>

                                    {/* เพศ*/}
                                    <div className="d-flex align-items-center justify-content-between mb-5">
                                        <p className="mb-0">เพศ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                        <div className="flex-grow-1 ms-3">
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>

                                    {/* button*/}
                                    <div className="btn-edit">
                                        <button type="button" className="btn-confirm">ยืนยัน</button>
                                        <button type="button" className="btn-cancle">ยกเลิก</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Edituser
