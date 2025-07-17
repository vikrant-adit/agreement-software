import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface HardwareItem {
  id: number;
  location_name: string;
  adit_voice_hardware: boolean;
  adit_pay_hardware: boolean;
  package_type: string;
  grandstream_grp2616_qty: number;
  grandstream_grp2613_qty: number;
  grandstream_dp720_qty: number;
  grp_2616_wall_mount_qty: number;
  grp_2613_wall_mount_qty: number;
  headset_adapter_qty: number;
  bbpos_wispos_qty: number;
  bbpos_edock_qty: number;
  granstrem_grp_2613_type: number; // 100 for new, 80 for used
  granstrem_dp_720_type: number; // 100 for new, 80 for used
  hardware_total: number;
}

@Component({
  selector: 'app-hardware-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view.html',
  styles: [`
    .hardware-order-container {
      width: 100%;
      overflow-x: auto;
    }
    
    .table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .table th,
    .table td {
      padding: 8px;
      text-align: center;
      border: 1px solid #ddd;
      vertical-align: middle;
    }
    
    .table th {
      background-color: #f8f9fa;
      font-weight: bold;
    }
    
    .prdctble-countr {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
    
    .prdctble-countr input {
      width: 60px;
      text-align: center;
      border: 1px solid #ddd;
      padding: 4px;
    }
    
    .qtyminus,
    .qtyplus {
      cursor: pointer;
      padding: 4px 8px;
      background-color: #f8f9fa;
      border: 1px solid #ddd;
      border-radius: 3px;
      user-select: none;
    }
    
    .qtyminus:hover,
    .qtyplus:hover {
      background-color: #e9ecef;
    }
    
    .blankinfo-field {
      opacity: 0.5;
      pointer-events: none;
    }
    
    .green_color {
      color: #28a745;
    }
    
    .pkgadvonly {
      display: none;
    }
    
    .form-check-input {
      margin: 0;
    }
    
    .locpackagetbl-slect {
      margin-left: 10px;
    }
    
    .locpackagetbl-slect select {
      padding: 2px 5px;
      border: 1px solid #ddd;
    }
  `]
})
export class HardwareOrderComponent implements OnInit {
  table_arr: HardwareItem[] = [];
  promotion_type: string = '';
  hardware_credit: number = 500; // Default hardware credit
  hardware_subtotal: number = 0;
  selectedGrp2613Type: string = 'New';
  selectedDp720Type: string = 'New';

  ngOnInit() {
    this.initializeData();
    this.calculateTotal();
  }

  initializeData() {
    // Initialize with default data if table_arr is empty
    if (this.table_arr.length === 0) {
      this.table_arr = [
        {
          id: 1,
          location_name: 'Default Location',
          adit_voice_hardware: false,
          adit_pay_hardware: false,
          package_type: 'Standard',
          grandstream_grp2616_qty: 2,
          grandstream_grp2613_qty: 0,
          grandstream_dp720_qty: 0,
          grp_2616_wall_mount_qty: 0,
          grp_2613_wall_mount_qty: 0,
          headset_adapter_qty: 0,
          bbpos_wispos_qty: 0,
          bbpos_edock_qty: 0,
          granstrem_grp_2613_type: 100,
          granstrem_dp_720_type: 100,
          hardware_total: 0
        }
      ];
    }
  }

  checkValueVH(item: HardwareItem, index: number) {
    // Handle voice hardware checkbox change
    if (!item.adit_voice_hardware) {
      // Reset voice hardware quantities when unchecked
      item.grandstream_grp2616_qty = 2;
      item.grandstream_grp2613_qty = 0;
      item.grandstream_dp720_qty = 0;
      item.grp_2616_wall_mount_qty = 0;
      item.grp_2613_wall_mount_qty = 0;
      item.headset_adapter_qty = 0;
    }
    this.calculateTotal();
  }

  checkValuePH(item: HardwareItem, index: number) {
    // Handle payment hardware checkbox change
    if (!item.adit_pay_hardware) {
      // Reset payment hardware quantities when unchecked
      item.bbpos_wispos_qty = 0;
      item.bbpos_edock_qty = 0;
    }
    this.calculateTotal();
  }

  increaseQuantity(item: HardwareItem, field: keyof HardwareItem, max: number) {
    const currentValue = item[field] as number;
    if (currentValue < max) {
      (item[field] as number) = currentValue + 1;
      this.calculateTotal();
    }
  }

  decreaseQuantity(item: HardwareItem, field: keyof HardwareItem, min: number) {
    const currentValue = item[field] as number;
    if (currentValue > min) {
      (item[field] as number) = currentValue - 1;
      this.calculateTotal();
    }
  }

  calculateTotal() {
    this.hardware_subtotal = 0;
    
    this.table_arr.forEach(item => {
      // Calculate hardware total for each item (you'll need to implement pricing logic)
      item.hardware_total = this.calculateItemTotal(item);
      
      // Calculate remaining amount after hardware credit
      let remainingAmount = 0;
      if (item.package_type !== 'Adit Lite') {
        remainingAmount = Math.max(0, item.hardware_total - this.hardware_credit);
      } else {
        remainingAmount = item.hardware_total;
      }
      
      this.hardware_subtotal += remainingAmount;
    });
  }

  calculateItemTotal(item: HardwareItem): number {
    // Implement your pricing logic here
    // This is a placeholder - you'll need to add actual pricing
    let total = 0;
    
    // Example pricing (replace with actual prices)
    total += item.grandstream_grp2616_qty * 100; // $100 per GRP 2616
    total += item.grandstream_grp2613_qty * (item.granstrem_grp_2613_type === 100 ? 80 : 64); // New vs Used
    total += item.grandstream_dp720_qty * (item.granstrem_dp_720_type === 100 ? 60 : 48); // New vs Used
    total += item.grp_2616_wall_mount_qty * 25;
    total += item.grp_2613_wall_mount_qty * 25;
    total += item.headset_adapter_qty * 40;
    total += item.bbpos_wispos_qty * 200;
    total += item.bbpos_edock_qty * 50;
    
    return total;
  }

  getHardwareCreditText(item: HardwareItem): string {
    if (item.package_type === 'Adit Lite') {
      return `$0 / $0`;
    }
    
    const hardwareCreditUsed = Math.min(item.hardware_total, this.hardware_credit);
    return `$${hardwareCreditUsed} / $${this.hardware_credit}`;
  }

  getLocationTotal(item: HardwareItem): number {
    if (item.package_type === 'Adit Lite') {
      return item.hardware_total;
    }
    
    return Math.max(0, item.hardware_total - this.hardware_credit);
  }

  // Method to add new location
  addLocation() {
    const newId = this.table_arr.length + 1;
    this.table_arr.push({
      id: newId,
      location_name: `Location ${newId}`,
      adit_voice_hardware: false,
      adit_pay_hardware: false,
      package_type: 'Standard',
      grandstream_grp2616_qty: 2,
      grandstream_grp2613_qty: 0,
      grandstream_dp720_qty: 0,
      grp_2616_wall_mount_qty: 0,
      grp_2613_wall_mount_qty: 0,
      headset_adapter_qty: 0,
      bbpos_wispos_qty: 0,
      bbpos_edock_qty: 0,
      granstrem_grp_2613_type: 100,
      granstrem_dp_720_type: 100,
      hardware_total: 0
    });
    this.calculateTotal();
  }

  // Method to remove location
  removeLocation(index: number) {
    if (this.table_arr.length > 1) {
      this.table_arr.splice(index, 1);
      this.calculateTotal();
    }
  }
}