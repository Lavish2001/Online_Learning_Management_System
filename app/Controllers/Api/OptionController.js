const { Options, Questions } = model("");
const { optionSchema } = validate("OptionValidator");
const { checkTeacher } = helper("CourseHelpers");



module.exports = class OptionController {




    // INSERT OPTIONS FOR QUESTIONS  //

    async insertOptions(req, res) {

        try {
            await checkTeacher(req.user)
            const { question_id } = req.query;
            if (question_id) {
                const question = await Questions.findOne({ where: { id: question_id } });
                if (question) {
                    const { error, value } = optionSchema.validate(req.body);
                    if (error) {
                        return res.status(400).json({ 'status': 'failed', 'message': error.message })
                    } else {
                        await Options.create({
                            question_id: question_id,
                            option: value.option
                        });
                        return res.status(200).json({ 'status': 'failed', 'success': 'question options inserted successfully' })
                    }
                } else {
                    return res.status(400).json({ 'status': 'failed', 'message': 'invalid question id' })
                }
            } else {
                return res.status(400).json({ 'status': 'failed', 'message': 'invalid question id' })
            }
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        };
    };




};