// add-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface SelectOption {
  id: number;
  name: string;
}

interface UploadedImage {
  file: File;
  url: string;
}

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss'],
})
export class AddEditComponent implements OnInit {
  // Form groups
  basicProductInformation!: FormGroup;
  productInformation!: FormGroup;
  productDescription!: FormGroup;
  deliveryAndReturns!: FormGroup;
  media!: FormGroup;

  // Component state
  isLinear = false;
  isEditing = false;
  productId?: number;
  uploadedImages: UploadedImage[] = [];
  errorMessage = '';

  // Dropdown options
  brands: SelectOption[] = [
    { id: 1, name: 'Brand A' },
    { id: 2, name: 'Brand B' },
    { id: 3, name: 'Brand C' },
  ];

  categories: SelectOption[] = [
    { id: 1, name: 'Category A' },
    { id: 2, name: 'Category B' },
    { id: 3, name: 'Category C' },
  ];

  collections: SelectOption[] = [
    { id: 1, name: 'Collection A' },
    { id: 2, name: 'Collection B' },
    { id: 3, name: 'Collection C' },
  ];

  recipients: SelectOption[] = [
    { id: 1, name: 'Men' },
    { id: 2, name: 'Women' },
    { id: 3, name: 'Unisex' },
  ];

  dialColors: SelectOption[] = [
    { id: 1, name: 'Black' },
    { id: 2, name: 'White' },
    { id: 3, name: 'Blue' },
  ];

  movements: SelectOption[] = [
    { id: 1, name: 'Quartz' },
    { id: 2, name: 'Automatic' },
    { id: 3, name: 'Mechanical' },
  ];

  strapMaterials: SelectOption[] = [
    { id: 1, name: 'Leather' },
    { id: 2, name: 'Metal' },
    { id: 3, name: 'Rubber' },
  ];

  caseMaterials: SelectOption[] = [
    { id: 1, name: 'Stainless Steel' },
    { id: 2, name: 'Plastic' },
    { id: 3, name: 'Titanium' },
  ];

  watchMarkers: SelectOption[] = [
    { id: 1, name: 'Roman' },
    { id: 2, name: 'Arabic' },
    { id: 3, name: 'Dashes' },
  ];

  deliveryOptions: SelectOption[] = [
    { id: 1, name: 'Standard Delivery' },
    { id: 2, name: 'Express Delivery' },
    { id: 3, name: 'Next-Day Delivery' },
  ];

  // Image upload configuration
  readonly allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  readonly maxImages = 5;
  readonly minImages = 2;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.checkForEditMode();
  }

  private initializeForms(): void {
    this.basicProductInformation = this.fb.group({
      productName: [''],
      brandId: [''],
      categoryId: [''],
      collectionId: [''],
      price: [''],
      recipientId: [''],
    });

    this.productInformation = this.fb.group({
      dialColorId: [''],
      diameter: [''],
      waterResistant: [false],
      movementId: [''],
      strapMaterialId: [''],
      caseMaterialId: [''],
      watchMarkersId: [''],
      manufacturerProductNumber: [''],
      guarantee: [''],
      deliveryOptionId: [''],
    });

    this.productDescription = this.fb.group({
      shortTitle: [''],
      detailedDescription: [''],
      additionalDescription: [''],
    });

    this.deliveryAndReturns = this.fb.group({
      deliveryInfo: [''],
      returnsPolicy: [''],
    });

    this.media = this.fb.group({});
  }

  private checkForEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.productId = +id;
      this.loadProductData();
    }
  }

  private async loadProductData(): Promise<void> {
    try {
      // Example of loading product data
      // const product = await this.productService.getProduct(this.productId);
      // this.patchFormValues(product);
    } catch (error) {
      console.error('Error loading product:', error);
      // Handle error appropriately
    }
  }

  private patchFormValues(product: any): void {
    this.basicProductInformation.patchValue({
      productName: product.productName,
      brandId: product.brandId,
      categoryId: product.categoryId,
      collectionId: product.collectionId,
      price: product.price,
    });

    // Patch other form groups similarly
  }

  // Form getters for template access
  get productName() {
    return this.basicProductInformation.get('productName');
  }
  get brandId() {
    return this.basicProductInformation.get('brandId');
  }
  get categoryId() {
    return this.basicProductInformation.get('categoryId');
  }
  get price() {
    return this.basicProductInformation.get('price');
  }
  get recipientId() {
    return this.productInformation.get('recipientId');
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files);

    if (files.length + this.uploadedImages.length > this.maxImages) {
      this.errorMessage = `Maximum ${this.maxImages} images allowed`;
      return;
    }

    files.forEach((file) => {
      if (!this.allowedImageTypes.includes(file.type)) {
        this.errorMessage = `Invalid file type: ${file.name}. Please upload JPEG, PNG, or JPG files.`;
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.uploadedImages.push({
            file,
            url: e.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    });

    this.errorMessage = '';
  }

  removeImage(index: number): void {
    this.uploadedImages.splice(index, 1);
  }

  isFormValid(): boolean {
    return (
      this.basicProductInformation.valid &&
      this.productInformation.valid &&
      this.productDescription.valid &&
      this.deliveryAndReturns.valid &&
      this.uploadedImages.length >= this.minImages &&
      this.uploadedImages.length <= this.maxImages
    );
  }

  async onSubmit(): Promise<void> {
    if (!this.isFormValid()) {
      this.errorMessage =
        'Please fill in all required fields and upload at least 2 images';
      return;
    }

    const formData = new FormData();

    // Combine all form values
    const productData = {
      ...this.basicProductInformation.value,
      ...this.productInformation.value,
      ...this.productDescription.value,
      ...this.deliveryAndReturns.value,
    };

    // Append form data
    Object.entries(productData).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    // Append images
    this.uploadedImages.forEach((image, index) => {
      formData.append(`image${index}`, image.file);
    });

    try {
      // Example of submitting the form
      // if (this.isEditing) {
      //   await this.productService.updateProduct(this.productId!, formData);
      // } else {
      //   await this.productService.createProduct(formData);
      // }

      // Navigate back to products list
      this.router.navigate(['/products']);
    } catch (error) {
      console.error('Error submitting form:', error);
      this.errorMessage =
        'An error occurred while saving the product. Please try again.';
    }
  }
}
