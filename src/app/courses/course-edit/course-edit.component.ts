import { Component, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { doc, updateDoc } from 'firebase/firestore';
import { ClassService } from 'src/app/services/classes/class.service';
import { getRouterLink, ClassData, courseCategories, courseLanguages } from 'src/app/shared/class/class';

@Component({
    selector: 'app-course-edit',
    templateUrl: './course-edit.component.html',
    styleUrls: ['./course-edit.component.scss'],
})
export class EditCourseMetadataComponent implements OnInit {
    courseName: string = ""
    languages = courseLanguages
    categories = courseCategories
    courseMetadataForm!: FormGroup
    courseData: ClassData | undefined

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private courseService: ClassService,
        // private afs: AngularFirestore,
        private afs: Firestore,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.courseName = this.route.snapshot.paramMap.get('courseId') || ""
        this.courseMetadataForm = this.formBuilder.group({
            category: ['', Validators.required],
            seasonSpring: [false, Validators.required],
            seasonSummer: [false, Validators.required],
            seasonFall: [false, Validators.required],
            languages: [''],
        })
        this.courseService.classes.subscribe(data => {
            this.courseData = data.find(x => x.ClassName == this.courseName)
            this.f.category.setValue(this.courseData?.category)
            this.f.seasonSpring.setValue(this.courseData?.season.spring)
            this.f.seasonSummer.setValue(this.courseData?.season.summer)
            this.f.seasonFall.setValue(this.courseData?.season.fall)
            this.f.languages.setValue(this.courseData?.languages)
        })
    }

    get f() {
        return this.courseMetadataForm?.controls
    }

    async onSubmit() {
        const ref = doc(this.afs, "Class", this.courseData?.courseId as string)
        await updateDoc(ref,
            {
                category: this.f.category.value,
                season: {
                    spring: this.f.seasonSpring.value,
                    summer: this.f.seasonSummer.value,
                    fall: this.f.seasonFall.value
                },
                languages: this.f.languages.value,
            }
        )
        // this.courseService.updateCourseData()
        var link = ''
        if (this.courseData) {
            link = getRouterLink(this.courseData)
        }
        this.router.navigate([link])
    }
}
