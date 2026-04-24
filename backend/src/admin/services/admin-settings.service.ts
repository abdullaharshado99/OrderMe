import { Injectable } from '@nestjs/common';
import { UpdateSettingsDto } from '../dto/settings.dto';

@Injectable()
export class AdminSettingsService {
    private settings = {
        allowSkipFinalExam: false,
        defaultPassPercentage: 50,
        enableCertificates: false,
    };

    getSettings() {
        return this.settings;
    }

    updateSettings(dto: UpdateSettingsDto) {
        this.settings = {
            ...this.settings,
            ...dto,
        };
        return this.settings;
    }
}