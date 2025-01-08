import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
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

  // Handle image upload
  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedImage = reader.result as string; // Convert the image to a base64 string
        this.productForm.patchValue({ imageUpload: this.uploadedImage }); // Set the value in the form
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle form submission
  onSubmit() {
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      console.log('Form Data:', formData);
      // Here, you can send the formData to your backend using an HTTP service.
    } else {
      console.error('Form is invalid');
    }
  }
}
