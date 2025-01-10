import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss'],
})
export class AddEditComponent implements OnInit {
  productForm!: FormGroup;

  // Sample data for dropdowns
  brands = [
    { id: 1, name: 'Brand A' },
    { id: 2, name: 'Brand B' },
    { id: 3, name: 'Brand C' },
  ];

  categories = [
    { id: 1, name: 'Category A' },
    { id: 2, name: 'Category B' },
    { id: 3, name: 'Category C' },
  ];

  recipients = [
    { id: 1, name: 'Men' },
    { id: 2, name: 'Women' },
    { id: 3, name: 'Unisex' },
  ];

  dialColors = [
    { id: 1, name: 'Black' },
    { id: 2, name: 'White' },
    { id: 3, name: 'Blue' },
  ];

  movements = [
    { id: 1, name: 'Quartz' },
    { id: 2, name: 'Automatic' },
    { id: 3, name: 'Mechanical' },
  ];

  strapMaterials = [
    { id: 1, name: 'Leather' },
    { id: 2, name: 'Metal' },
    { id: 3, name: 'Rubber' },
  ];

  caseMaterials = [
    { id: 1, name: 'Stainless Steel' },
    { id: 2, name: 'Plastic' },
    { id: 3, name: 'Titanium' },
  ];

  watchMarkers = [
    { id: 1, name: 'Roman' },
    { id: 2, name: 'Arabic' },
    { id: 3, name: 'Dashes' },
  ];

  deliveryOptions = [
    { id: 1, name: 'Standard Delivery' },
    { id: 2, name: 'Express Delivery' },
    { id: 3, name: 'Next-Day Delivery' },
  ];
  uploadedImage: string | null = null;
  product = 'assets/img/shop/product/product_1.png';
  collections = [
    { id: 1, name: 'Standard Delivery' },
    { id: 2, name: 'Express Delivery' },
    { id: 3, name: 'Next-Day Delivery' },
  ];
  uploadedImages: { file: File; url: string }[] = [];
  errorMessage: string = '';

  // Allowed image types
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.productForm = this.fb.group({
      // Fields for Products table
      productName: ['', Validators.required],
      brandId: ['', Validators.required],
      categoryId: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      recipientId: ['', Validators.required],
      imageUpload: [null],

      // Fields for ProductDetails table
      dialColorId: [''],
      diameter: [''],
      waterResistant: [''],
      movementId: [''],
      strapMaterialId: [''],
      caseMaterialId: [''],
      watchMarkersId: [''],
      manufacturerProductNumber: [''],
      guarantee: [''],
      deliveryOptionId: [''],
      collectionId: [''],
      descriptionTitle: [''],
      descriptionContent: [''],
      deliveryInfo: [''],
      returnsPolicy: [''],
    });
  }

  // Getter methods for easy access to form controls
  get productName() {
    return this.productForm.get('productName');
  }

  get brandId() {
    return this.productForm.get('brandId');
  }

  get categoryId() {
    return this.productForm.get('categoryId');
  }

  get price() {
    return this.productForm.get('price');
  }

  get recipientId() {
    return this.productForm.get('recipientId');
  }

  get dialColorId() {
    return this.productForm.get('dialColorId');
  }

  get diameter() {
    return this.productForm.get('diameter');
  }

  get waterResistant() {
    return this.productForm.get('waterResistant');
  }

  get movementId() {
    return this.productForm.get('movementId');
  }

  get strapMaterialId() {
    return this.productForm.get('strapMaterialId');
  }

  get caseMaterialId() {
    return this.productForm.get('caseMaterialId');
  }

  get watchMarkersId() {
    return this.productForm.get('watchMarkersId');
  }

  get manufacturerProductNumber() {
    return this.productForm.get('manufacturerProductNumber');
  }

  get guarantee() {
    return this.productForm.get('guarantee');
  }

  get deliveryOptionId() {
    return this.productForm.get('deliveryOptionId');
  }

  // Handle form submission
  onSubmit() {
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      // Here, you can send the formData to your backend using an HTTP service.
    } else {
      console.error('Form is invalid');
    }
  }

  // Handle Image Upload
  onImageUpload(event: any): void {
    const files: FileList = event.target.files;

    if (files.length + this.uploadedImages.length > 5) {
      alert('You can upload a maximum of 5 images.');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!this.allowedTypes.includes(file.type)) {
        this.errorMessage = `Invalid file type: ${file.name}. Please upload standard images (JPEG, PNG, JPG).`;
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImages.push({ file, url: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  // Remove Image
  removeImage(index: number): void {
    this.uploadedImages.splice(index, 1);
  }

  // Optional: Validate before form submission
  validateImageUpload(): boolean {
    if (this.uploadedImages.length < 2) {
      alert('Please upload at least 2 images.');
      return false;
    }
    return true;
  }
}
