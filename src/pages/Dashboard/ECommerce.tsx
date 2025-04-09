import React, { useState } from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChartThree from '../../components/Charts/ChartThree';
import TableOne from '../../components/Tables/TableOne';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined';
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import BedroomChildOutlinedIcon from '@mui/icons-material/BedroomChildOutlined';
import MedicationLiquidOutlinedIcon from '@mui/icons-material/MedicationLiquidOutlined';
import BiotechOutlinedIcon from '@mui/icons-material/BiotechOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';

const ECommerce: React.FC = () => {
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
  
    const showBedsPopup = () => {
      setIsModalVisible(true);
    };
  
    const handleClose = () => {
      setIsModalVisible(false);
    };

  return (
    <>
    <Modal title="BEDS" open={isModalVisible} onCancel={handleClose} footer={null}>
          <h1>100 Beds available</h1>
        </Modal>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div onClick={() => navigate("/clientList")}>
          <CardDataStats title="Client's" total="3.456K" rate="0.43%" levelUp>
            <LocalHospitalOutlinedIcon color="primary" />
          </CardDataStats>
        </div>
        <CardDataStats title="Nurse" total="2.32K" rate="4.35%" levelUp>
          <BloodtypeOutlinedIcon color="primary"/>
        </CardDataStats>
        <CardDataStats title="Pharmacist" total="$2.450" rate="2.59%" levelUp>
          <VaccinesOutlinedIcon color="primary"/>
        </CardDataStats>
        <CardDataStats title="Acountant" total="$3.456" rate="0.95%" levelDown>
          <GroupOutlinedIcon color="primary"/>
        </CardDataStats>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 pt-6">
        <div onClick={() => navigate("/doctorsList")}>
        <CardDataStats  title="Doctors" total="3.456K" rate="0.43%" levelUp>
          <PersonOutlineOutlinedIcon color="primary"/>
        </CardDataStats>
        </div>
        <CardDataStats title="Laboratorist" total="4,267K" rate="4.35%" levelUp>
          <BiotechOutlinedIcon color="primary"/>
        </CardDataStats>
        <div onClick={() => navigate("/medicineList")}>
        <CardDataStats title="Medicines" total="$2.450K" rate="2.59%" levelUp>
            <MedicationLiquidOutlinedIcon color="primary"/>
        </CardDataStats>
        </div>
        <div onClick={()=> showBedsPopup()}>
        <CardDataStats title="Beds" total="3456" rate="0.95%" levelDown>
          <BedroomChildOutlinedIcon color="primary"/>
        </CardDataStats>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
      <div className="col-span-12 xl:col-span-12">
          <ChartThree />  
        </div>
        <div className="col-span-12 xl:col-span-12">
          <TableOne />
        </div>

      </div>
    </>
  );
};

export default ECommerce;
